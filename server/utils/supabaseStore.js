const TABLES = {
  users: {
    name: 'skilltern_users',
    columns: (doc) => ({ email: doc.email, username: doc.username, role: doc.role })
  },
  skills: {
    name: 'skilltern_skills',
    columns: (doc) => ({ name: doc.name, category: doc.category })
  },
  swaps: {
    name: 'skilltern_swaps',
    columns: (doc) => ({
      sender_id: idOf(doc.sender), receiver_id: idOf(doc.receiver),
      skill_offered_id: idOf(doc.skillOffered), skill_wanted_id: idOf(doc.skillWanted), status: doc.status
    })
  },
  messages: {
    name: 'skilltern_messages',
    columns: (doc) => ({ sender_id: idOf(doc.sender), receiver_id: idOf(doc.receiver), read: doc.read })
  },
  transactions: {
    name: 'skilltern_transactions',
    columns: (doc) => ({ user_id: idOf(doc.user), related_user_id: idOf(doc.relatedUser), type: doc.type })
  },
  internships: {
    name: 'skilltern_internships',
    columns: (doc) => ({ posted_by_id: idOf(doc.postedBy), status: doc.status })
  },
  applications: {
    name: 'skilltern_applications',
    columns: (doc) => ({
      internship_id: idOf(doc.internship), applicant_id: idOf(doc.applicant),
      status: doc.status, profile_fit_score: Number(doc.profileFitScore || 0)
    })
  }
};

let config = null;

function idOf(value) {
  if (value === undefined || value === null || value === '') return null;
  return String(value._id || value);
}

function configure({ url, secretKey, legacyServiceRole = false }) {
  if (!url || !secretKey) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are both required.');
  config = { url: url.replace(/\/+$/, ''), secretKey, legacyServiceRole };
}

function authHeaders() {
  return {
    apikey: config.secretKey,
    ...(config.legacyServiceRole ? { authorization: `Bearer ${config.secretKey}` } : {})
  };
}

async function request(path, options = {}) {
  if (!config) throw new Error('Supabase storage is not configured.');
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.status === 204 ? null : response.json().catch(() => null);
}

async function readTable(collection, table) {
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(`${config.url}/rest/v1/${table}?select=document_id,data&order=document_id.asc`, {
      headers: {
        ...authHeaders(),
        range: `${offset}-${offset + pageSize - 1}`,
        'range-unit': 'items'
      }
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Supabase database read failed (${response.status}): ${detail.slice(0, 300)}`);
    }
    const page = await response.json();
    rows.push(...page.map((row) => ({ collection, document_id: row.document_id, data: row.data })));
    if (page.length < pageSize) break;
  }
  return rows;
}

async function loadDocuments() {
  const collections = Object.entries(TABLES);
  const pages = await Promise.all(collections.map(([collection, { name }]) => readTable(collection, name)));
  return pages.flat();
}

async function upsertDocuments(collection, documents) {
  if (!documents?.length) return;
  const table = TABLES[collection];
  if (!table) throw new Error(`Unknown Supabase collection: ${collection}`);
  const rows = documents.map((document) => ({
    document_id: String(document._id),
    data: document,
    created_at: document.createdAt || new Date().toISOString(),
    updated_at: document.updatedAt || new Date().toISOString(),
    ...table.columns(document)
  }));
  await request(`${table.name}?on_conflict=document_id`, {
    method: 'POST',
    headers: { prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows)
  });
}

async function deleteDocuments(collection, ids) {
  if (!ids?.length) return;
  const table = TABLES[collection];
  if (!table) throw new Error(`Unknown Supabase collection: ${collection}`);
  const query = new URLSearchParams({
    document_id: `in.(${ids.map((id) => `"${String(id).replaceAll('"', '')}"`).join(',')})`
  });
  await request(`${table.name}?${query.toString()}`, { method: 'DELETE' });
}

async function deleteCollection(collection) {
  const table = TABLES[collection];
  if (!table) throw new Error(`Unknown Supabase collection: ${collection}`);
  await request(`${table.name}?document_id=not.is.null`, { method: 'DELETE' });
}

async function persistSnapshot(snapshot) {
  for (const [collection, { name }] of Object.entries(TABLES)) {
    if (snapshot[collection]?.length) await upsertDocuments(collection, snapshot[collection]);
  }
}

module.exports = { TABLES, configure, loadDocuments, upsertDocuments, deleteDocuments, deleteCollection, persistSnapshot };
