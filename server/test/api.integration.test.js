const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dbFile = path.join(os.tmpdir(), `skilltern-api-test-${process.pid}.json`);
process.env.SKILLTERN_DB_FILE = dbFile;
process.env.JWT_SECRET = 'skilltern-integration-test-secret-32chars-minimum';
process.env.NODE_ENV = 'test';

const { app } = require('../server');
const embeddedDb = require('../utils/embeddedDb');
const { ensureSkillCatalog, skillsData } = require('../seed');
const Skill = require('../models/Skill');
embeddedDb.setUsingEmbedded(true);

test('API supports student swap and recruiter application flows with role and ownership checks', { timeout: 20000 }, async (t) => {
  try { fs.unlinkSync(dbFile); } catch (_) { /* isolated test database may not exist */ }
  const legacyMath2 = await Skill.create({ name: 'Engineering Mathematics-II', category: 'Semester 2' });
  assert.equal(await ensureSkillCatalog(), skillsData.length - 1);
  const canonicalMath2 = await Skill.findOne({ name: 'Mathematics-2' });
  assert.equal(String(canonicalMath2._id), String(legacyMath2._id));
  assert.equal(await Skill.findOne({ name: 'Engineering Mathematics-II' }), null);
  assert.equal(await ensureSkillCatalog(), 0, 'catalog sync should be idempotent');

  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
  } catch (error) {
    await new Promise((resolve) => server.close(resolve));
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      t.skip(`Sandbox does not allow a loopback API listener (${error.code}); run npm test with local socket access for the live integration pass.`);
      return;
    }
    throw error;
  }

  t.after(async () => {
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
    try { fs.unlinkSync(dbFile); } catch (_) { /* cleaned up */ }
  });

  const base = `http://127.0.0.1:${server.address().port}/api`;
  const call = async (url, { token, method = 'GET', body } = {}) => {
    const response = await fetch(`${base}${url}`, {
      method,
      headers: {
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(5000)
    });
    const data = await response.json();
    return { status: response.status, data };
  };
  const health = await call('/health');
  assert.equal(health.data.database, 'local-json');
  assert.equal(health.data.persistent, true);
  const skillCatalog = await call('/skills');
  assert.equal(skillCatalog.status, 200);
  assert.ok(skillCatalog.data.skills.length >= skillsData.length);
  assert.ok(skillCatalog.data.skills.some((skill) => skill.category === 'Mechanical Engineering'));
  assert.ok(skillCatalog.data.skills.some((skill) => skill.name === 'Mathematics-2'));
  const register = async (name, username, role = 'student') => {
    const result = await call('/auth/register', {
      method: 'POST',
      body: { name, username, email: `${username}@example.test`, password: 'testing123', confirmPassword: 'testing123', role, company: role === 'recruiter' ? 'Example Co' : undefined }
    });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    assert.equal(result.data.user.erpId, '');
    assert.equal(result.data.user.isErpVerified, false);
    return result.data;
  };

  const alice = await register('Alice Student', 'alice');
  const bob = await register('Bob Student', 'bob');
  const recruiter = await register('Riley Recruiter', 'riley', 'recruiter');
  const otherRecruiter = await register('Robin Recruiter', 'robin', 'recruiter');

  const invalidCategory = await call('/skills', { token: alice.token, method: 'POST', body: { name: 'Invalid Category Skill', category: 'Not an engineering category' } });
  assert.equal(invalidCategory.status, 400);
  const skillA = await call('/skills', { token: alice.token, method: 'POST', body: { name: 'Integration Skill A', category: 'Computer Science' } });
  const skillB = await call('/skills', { token: bob.token, method: 'POST', body: { name: 'Integration Skill B', category: 'Semester 2' } });
  assert.equal(skillA.status, 201);
  assert.equal(skillB.status, 201);
  assert.equal((await call('/users/me/skills', { token: alice.token, method: 'POST', body: { skillId: skillA.data.skill._id, list: 'teach' } })).status, 200);
  assert.equal((await call('/users/me/skills', { token: bob.token, method: 'POST', body: { skillId: skillB.data.skill._id, list: 'teach' } })).status, 200);

  assert.equal((await call('/swaps/active', { token: recruiter.token })).status, 403);
  const invalidSwap = await call('/swaps', { token: alice.token, method: 'POST', body: { receiver: bob.user._id, skillOffered: skillB.data.skill._id, skillWanted: skillB.data.skill._id } });
  assert.equal(invalidSwap.status, 400);
  const swap = await call('/swaps', { token: alice.token, method: 'POST', body: { receiver: bob.user._id, skillOffered: skillA.data.skill._id, skillWanted: skillB.data.skill._id, message: 'Test swap' } });
  assert.equal(swap.status, 201, JSON.stringify(swap.data));
  assert.equal((await call(`/swaps/${swap.data.swap._id}/accept`, { token: bob.token, method: 'PUT' })).status, 200);
  assert.equal((await call(`/swaps/${swap.data.swap._id}/complete`, { token: alice.token, method: 'PUT' })).status, 200);
  const aliceAfterSwap = await call('/users/me', { token: alice.token });
  assert.equal(aliceAfterSwap.data.user.completedSwaps, 1);
  assert.equal(aliceAfterSwap.data.user.credits, 105);

  const listing = await call('/internships', { token: recruiter.token, method: 'POST', body: { title: 'API Integration Intern', company: 'Example Co', requiredSkills: ['Integration Skill A'] } });
  assert.equal(listing.status, 201, JSON.stringify(listing.data));
  assert.equal((await call('/internships/recruiter/mine', { token: recruiter.token })).data.internships.length, 1);
  assert.equal((await call('/internships/recruiter/mine', { token: otherRecruiter.token })).data.internships.length, 0);
  const application = await call(`/internships/${listing.data.internship._id}/apply`, { token: alice.token, method: 'POST', body: { coverLetter: 'Integration test application' } });
  assert.equal(application.status, 201, JSON.stringify(application.data));
  assert.equal(typeof application.data.application.profileFitScore, 'number');
  const recruiterApps = await call('/internships/recruiter/all-applications', { token: recruiter.token });
  assert.equal(recruiterApps.data.applications.length, 1);
  assert.equal((await call(`/internships/applications/${application.data.application._id}/status`, { token: otherRecruiter.token, method: 'PUT', body: { status: 'shortlisted' } })).status, 403);
  assert.equal((await call(`/internships/applications/${application.data.application._id}/status`, { token: recruiter.token, method: 'PUT', body: { status: 'shortlisted' } })).status, 200);
});
