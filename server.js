require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const { setDBMode } = require('./controllers/projectController');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── View Engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Global Template Locals ───────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.developer = {
    name: 'Don the Techie',
    role: 'Full-Stack Developer',
    tagline: 'Crafting stunning and dynamic digital experiences',
    github: 'https://github.com/DonBabu-ux',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/',
    email: 'lilbeelogics@gmail.com',
    phone: '+254117234064',
    avatar: '/images/avatar.jpg',
    stack: ['React', 'Node.js', 'Next.js', 'EJS', 'Tailwind CSS', 'TypeScript']
  };
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', require('./routes/index'));
app.use('/projects', require('./routes/projects'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 | Dev Portfolio',
    message: 'Page Not Found',
    error: { status: 404 }
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error | Dev Portfolio',
    message: 'Internal Server Error',
    error: err
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const start = async () => {
  const isMongoConnected = await connectDB();
  setDBMode(isMongoConnected);

  app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio running at http://localhost:${PORT}`);
    console.log(`📦 Data source: ${isMongoConnected ? 'MongoDB' : 'JSON file'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start();
