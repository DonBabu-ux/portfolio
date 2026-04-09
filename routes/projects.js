const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectBySlug,
  getCategories
} = require('../controllers/projectController');
const { getRepoInfo, getRepoTree, getFileContent } = require('../utils/github');

// ─── All Projects ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const [projects, categories] = await Promise.all([
      getAllProjects(filter),
      getCategories()
    ]);
    res.render('projects', {
      title: 'Projects | Dev Portfolio',
      projects,
      categories: ['All', ...categories],
      activeCategory: category || 'All',
      page: 'projects'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load projects', error: err });
  }
});

// ─── Single Project ───────────────────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).render('error', { message: 'Project not found', error: {} });
    }

    // Optionally pull live GitHub repo stats (non-blocking)
    let repoInfo = null;
    if (project.githubRepo) {
      repoInfo = await getRepoInfo(project.githubRepo).catch(() => null);
    }

    res.render('project', {
      title: `${project.title} | Dev Portfolio`,
      project,
      repoInfo,
      page: 'projects'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load project', error: err });
  }
});

// ─── API: Get Repo File Tree ──────────────────────────────────────────────────
router.get('/:slug/api/tree', async (req, res) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project || !project.githubRepo) {
      return res.status(404).json({ error: 'No GitHub repo configured' });
    }
    const files = await getRepoTree(project.githubRepo);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API: Get Single File Content ─────────────────────────────────────────────
router.get('/:slug/api/file', async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'path query param required' });

    const project = await getProjectBySlug(req.params.slug);
    if (!project || !project.githubRepo) {
      return res.status(404).json({ error: 'No GitHub repo configured' });
    }

    const content = await getFileContent(project.githubRepo, path);
    if (!content) return res.status(404).json({ error: 'File not found' });

    res.json({ content, path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
