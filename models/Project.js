const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  tech: [{ type: String }],
  previewUrl: { type: String },
  githubRepo: { type: String },
  image: { type: String },
  mockups: [{ type: String }],
  featured: { type: Boolean, default: false },
  category: { type: String, default: 'Web' },
  year: { type: Number, default: new Date().getFullYear() },
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
