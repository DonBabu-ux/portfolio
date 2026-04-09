const express = require('express');
const router = express.Router();
const { getFeaturedProjects } = require('../controllers/projectController');

// ─── Home Page ────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const featured = await getFeaturedProjects();
    res.render('index', {
      title: 'Dev Portfolio | Full-Stack Developer',
      featured,
      page: 'home'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Something went wrong', error: err });
  }
});

// ─── Contact POST ─────────────────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  // Return JSON for AJAX calls
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  try {
    // Optional: send email via Nodemailer if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`
      });
    }
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

module.exports = router;
