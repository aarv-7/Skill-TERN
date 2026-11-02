const test = require('node:test');
const assert = require('node:assert/strict');
const store = require('../utils/supabaseStore');

test('Supabase document writes stay server-side and use conflict-safe upserts', async (t) => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  let captured;
  global.fetch = async (url, options) => {
    captured = { url: String(url), options };
    return { ok: true, status: 204, json: async () => null };
  };
  store.configure({ url: 'https://demo-project.supabase.co/', secretKey: 'server-only-test-secret' });

  await store.upsertDocuments('skills', [{ _id: 'skill-1', name: 'Mathematics-2' }]);

  assert.match(captured.url, /skilltern_skills\?on_conflict=document_id$/);
  assert.equal(captured.options.headers.apikey, 'server-only-test-secret');
  assert.equal(captured.options.headers.authorization, undefined, 'new secret keys are sent via apikey only');
  assert.equal(captured.options.headers.prefer, 'resolution=merge-duplicates,return=minimal');
  const row = JSON.parse(captured.options.body)[0];
  assert.equal(row.document_id, 'skill-1');
  assert.equal(row.name, 'Mathematics-2');
  assert.deepEqual(row.data, { _id: 'skill-1', name: 'Mathematics-2' });
});

test('Supabase bootstrap reads paginated persisted records', async (t) => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  const ranges = [];
  const pageByTable = new Map();
  global.fetch = async (url, options) => {
    ranges.push(options.headers.range);
    const table = new URL(String(url)).pathname.split('/').at(-1);
    const pageNumber = (pageByTable.get(table) || 0) + 1;
    pageByTable.set(table, pageNumber);
    const page = table === 'skilltern_users' && pageNumber === 1
      ? Array.from({ length: 1000 }, (_, index) => ({ collection: 'skills', document_id: String(index), data: { _id: String(index) } }))
      : table === 'skilltern_users' && pageNumber === 2
        ? [{ collection: 'users', document_id: 'user-1', data: { _id: 'user-1' } }]
        : [];
    return { ok: true, status: 200, json: async () => page };
  };
  store.configure({ url: 'https://demo-project.supabase.co', secretKey: 'server-only-test-secret' });

  const rows = await store.loadDocuments();

  assert.equal(ranges.filter((range) => range === '1000-1999').length, 1);
  assert.equal(ranges.length, 8, 'reads each table and paginates the users table');
  assert.equal(rows.length, 1001);
  assert.equal(rows.at(-1).collection, 'users');
});

test('Supabase delete requests are scoped to collection and document IDs', async (t) => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  let capturedUrl;
  global.fetch = async (url) => {
    capturedUrl = String(url);
    return { ok: true, status: 204, json: async () => null };
  };
  store.configure({ url: 'https://demo-project.supabase.co', secretKey: 'server-only-test-secret' });

  await store.deleteDocuments('skills', ['skill-1', 'skill-2']);

  const query = new URL(capturedUrl).searchParams;
  assert.match(capturedUrl, /skilltern_skills\?/);
  assert.equal(query.get('document_id'), 'in.("skill-1","skill-2")');
});

test('legacy service role credentials also populate Authorization for JWT compatibility', async (t) => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  let captured;
  global.fetch = async (_url, options) => {
    captured = options;
    return { ok: true, status: 204, json: async () => null };
  };
  store.configure({ url: 'https://demo-project.supabase.co', secretKey: 'legacy-jwt-test-key', legacyServiceRole: true });

  await store.upsertDocuments('users', [{ _id: 'user-1' }]);

  assert.equal(captured.headers.apikey, 'legacy-jwt-test-key');
  assert.equal(captured.headers.authorization, 'Bearer legacy-jwt-test-key');
});

test('Supabase startup uses the remote store and persists model writes', async (t) => {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');
  const dbFile = path.join(os.tmpdir(), `skilltern-supabase-store-${process.pid}.json`);
  try { fs.unlinkSync(dbFile); } catch (_) { /* isolated test file */ }
  process.env.SKILLTERN_DB_FILE = dbFile;
  process.env.SUPABASE_URL = 'https://demo-project.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'server-only-test-secret';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const embeddedDb = require('../utils/embeddedDb');
  const { connectDB } = require('../utils/db');
  const previousFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    return options.method === 'POST'
      ? { ok: true, status: 204, json: async () => null }
      : { ok: true, status: 200, json: async () => [] };
  };
  t.after(() => {
    global.fetch = previousFetch;
    embeddedDb.setStorageMode('local-json');
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.SKILLTERN_DB_FILE;
    try { fs.unlinkSync(dbFile); } catch (_) { /* isolated test file */ }
    try { fs.unlinkSync(`${dbFile}.${process.pid}.tmp`); } catch (_) { /* atomic-write temp file */ }
  });

  await connectDB();
  assert.equal(embeddedDb.state.storageMode, 'supabase');
  await embeddedDb.EmbeddedSkill.create({ _id: 'skill-math2', name: 'Mathematics-2', category: 'Semester 2' });

  assert.equal(calls.length, 8);
  assert.ok(calls.slice(0, 7).every((call) => call.options.method === undefined), 'startup loads each remote table');
  assert.equal(calls[7].options.method, 'POST', 'model creation writes to Supabase');
  assert.equal(calls[7].options.headers.apikey, 'server-only-test-secret');
  assert.equal(calls[7].options.headers.authorization, undefined);
  const persisted = JSON.parse(calls[7].options.body)[0];
  assert.equal(persisted.name, 'Mathematics-2');
  assert.equal(persisted.document_id, 'skill-math2');
  assert.equal(persisted.data._id, 'skill-math2');
  assert.equal(persisted.data.name, 'Mathematics-2');
});
