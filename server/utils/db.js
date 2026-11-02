const embeddedDb = require('./embeddedDb');
const supabaseStore = require('./supabaseStore');

async function connectDB() {
  const url = process.env.SUPABASE_URL;
  const legacyServiceRole = !process.env.SUPABASE_SECRET_KEY && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (Boolean(url) !== Boolean(secretKey)) {
    throw new Error('Set both SUPABASE_URL and SUPABASE_SECRET_KEY to use Supabase.');
  }

  if (url && secretKey) {
    embeddedDb.setStorageMode('supabase');
    supabaseStore.configure({ url, secretKey, legacyServiceRole });
    const rows = await supabaseStore.loadDocuments();
    if (rows.length) {
      embeddedDb.hydrateDocuments(rows);
    } else {
      // First Supabase run migrates existing local demo data instead of replacing it.
      await embeddedDb.persistSnapshot();
    }
    console.log(`✅ Supabase connected; loaded ${rows.length} persisted records.`);
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required in production.');
  }
  embeddedDb.setStorageMode('local-json');
  console.log('ℹ️ Supabase is not configured. Using persistent local demo database (server/data/db.json).');
}

module.exports = { connectDB };
