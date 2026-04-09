const path = require('path');
const fs = require('fs');

let Project;
let usingMongo = false;

const setDBMode = (isMongoConnected) => {
  usingMongo = isMongoConnected;
  if (isMongoConnected) {
    Project = require('../models/Project');
  }
};

// ─── Load JSON fallback data ─────────────────────────────────────────────────
const loadJSON = () => {
  const filePath = path.join(__dirname, '../data/projects.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// ─── Get all projects ─────────────────────────────────────────────────────────
const getAllProjects = async (filter = {}) => {
  if (usingMongo) {
    return Project.find(filter).sort({ featured: -1, createdAt: -1 });
  }
  let data = loadJSON();
  if (filter.category) data = data.filter((p) => p.category === filter.category);
  if (filter.featured) data = data.filter((p) => p.featured === true);
  return data;
};

// ─── Get single project by slug ───────────────────────────────────────────────
const getProjectBySlug = async (slug) => {
  if (usingMongo) {
    return Project.findOne({ slug });
  }
  const data = loadJSON();
  return data.find((p) => p.slug === slug) || null;
};

// ─── Get featured projects ────────────────────────────────────────────────────
const getFeaturedProjects = async () => {
  if (usingMongo) {
    return Project.find({ featured: true }).limit(3);
  }
  return loadJSON().filter((p) => p.featured).slice(0, 3);
};

// ─── Get all unique categories ────────────────────────────────────────────────
const getCategories = async () => {
  if (usingMongo) {
    return Project.distinct('category');
  }
  const data = loadJSON();
  return [...new Set(data.map((p) => p.category))];
};

module.exports = {
  setDBMode,
  getAllProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getCategories
};
