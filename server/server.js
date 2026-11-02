require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utils/db');
const { state: databaseState } = require('./utils/embeddedDb');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const swapRoutes = require('./routes/swapRoutes');
const messageRoutes = require('./routes/messageRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Set it in server/.env before starting the API.');
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters.');
}
if (process.env.NODE_ENV === 'production' && corsOrigins.length === 0) {
  throw new Error('CORS_ORIGINS is required in production. Add the deployed frontend origin.');
}

app.use(cors(corsOrigins.length ? {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
} : {}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// The built Vite app is the production frontend. Uploaded avatars remain public.
const clientDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    name: 'Skill-TERN',
    slogan: 'Identify your skill gaps → Swap skills with peers to master them → Earn credits and boost your readiness → Get matched with internships.',
    message: 'Skill-TERN API is running',
    database: databaseState.storageMode,
    persistent: true
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all contact fields' });
  }
  res.json({ success: true, message: 'Thanks — we received your message at Skill-TERN.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', transactionRoutes);
app.use('/api/internships', internshipRoutes);

// Catch-all route for client-side React routes.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  if (req.method !== 'GET') return next();

  if (fs.existsSync(path.join(clientDist, 'index.html'))) {
    return res.sendFile(path.join(clientDist, 'index.html'));
  }
  res.status(503).type('text/plain').send('Frontend not built. Run npm run build from the repository root.');
});

app.use(errorHandler);

const User = require('./models/User');
const { seedData, ensureSkillCatalog } = require('./seed');

async function startServer(port = PORT) {
  await connectDB();
  try {
    const count = await User.countDocuments();
    if (count === 0 && process.env.NODE_ENV !== 'production') {
      console.log('Database empty — seeding Skill-TERN demo users, skills, and internships...');
      await seedData();
    } else {
      const addedSkills = await ensureSkillCatalog();
      if (addedSkills) console.log(`Added ${addedSkills} engineering skills to the database catalog.`);
    }
  } catch (err) {
    console.warn('Auto-seed check:', err.message);
  }
  return app.listen(port, () => {
    console.log(`Skill-TERN API running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Skill-TERN could not start:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
