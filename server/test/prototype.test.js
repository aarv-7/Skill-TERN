const test = require('node:test');
const assert = require('node:assert/strict');
const { requireRole } = require('../middleware/authMiddleware');
const { projectFields, DocInstance } = require('../utils/embeddedDb');

function runRoleCheck(role, requiredRole) {
  let statusCode = 200;
  let payload;
  let continued = false;
  const req = role ? { user: { role } } : {};
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    }
  };
  requireRole(requiredRole)(req, res, () => { continued = true; });
  return { statusCode, payload, continued };
}

test('role guards deny unauthenticated and wrong-role users', () => {
  assert.equal(runRoleCheck(undefined, 'recruiter').statusCode, 401);
  assert.equal(runRoleCheck('student', 'recruiter').statusCode, 403);
  assert.equal(runRoleCheck('recruiter', 'recruiter').continued, true);
});

test('embedded database projections exclude secret fields and support allowlists', () => {
  const user = { _id: 'u1', name: 'Demo', email: 'demo@example.test', password: 'hash', credits: 100 };
  assert.deepEqual(projectFields(user, '-password'), {
    _id: 'u1', name: 'Demo', email: 'demo@example.test', credits: 100
  });
  assert.deepEqual(projectFields(user, 'name credits'), {
    _id: 'u1', name: 'Demo', credits: 100
  });
  const projectedDocument = new DocInstance(projectFields(user, '-password'), 'users', user);
  projectedDocument.name = 'Updated Demo';
  assert.equal(projectedDocument.toObject().password, 'hash');
  assert.equal(projectedDocument.toObject().name, 'Updated Demo');
});

test('embedded applications populate applicant and internship summaries', async (context) => {
  const db = require('../utils/embeddedDb');
  db.setUsingEmbedded(true);
  const applications = await db.EmbeddedApplication.find({}).limit(1)
    .populate('applicant', 'name email')
    .populate('internship', 'title');
  if (!applications.length) {
    context.skip('No local demo records are present; development startup seeds them.');
    return;
  }
  assert.equal(typeof applications[0].applicant, 'object');
  assert.equal(typeof applications[0].internship, 'object');
  assert.equal(applications[0].applicant.password, undefined);
  assert.ok(applications[0].internship.title);
});
