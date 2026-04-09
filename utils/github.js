const axios = require('axios');
const NodeCache = require('node-cache');

// Cache GitHub responses for 10 minutes to avoid rate limits
const cache = new NodeCache({ stdTTL: 600 });

const githubHeaders = {
  Accept: 'application/vnd.github.v3+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  })
};

/**
 * Fetch repository info from GitHub
 */
const getRepoInfo = async (repoPath) => {
  const cacheKey = `repo:${repoPath}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoPath}`,
      { headers: githubHeaders }
    );
    const result = {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      url: data.html_url,
      topics: data.topics || [],
      updatedAt: data.updated_at
    };
    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`GitHub API error for ${repoPath}:`, err.message);
    return null;
  }
};

/**
 * Fetch repository file tree
 */
const getRepoTree = async (repoPath, branch = 'main') => {
  const cacheKey = `tree:${repoPath}:${branch}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoPath}/git/trees/${branch}?recursive=1`,
      { headers: githubHeaders }
    );
    const files = data.tree
      .filter((item) => item.type === 'blob')
      .map((item) => ({
        path: item.path,
        size: item.size,
        sha: item.sha
      }))
      .slice(0, 50); // limit to 50 files

    cache.set(cacheKey, files);
    return files;
  } catch (err) {
    // Try 'master' branch if 'main' fails
    if (branch === 'main') return getRepoTree(repoPath, 'master');
    console.error(`GitHub tree error for ${repoPath}:`, err.message);
    return [];
  }
};

/**
 * Fetch content of a specific file
 */
const getFileContent = async (repoPath, filePath) => {
  const cacheKey = `file:${repoPath}:${filePath}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoPath}/contents/${filePath}`,
      { headers: githubHeaders }
    );
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    cache.set(cacheKey, content);
    return content;
  } catch (err) {
    console.error(`GitHub file error for ${repoPath}/${filePath}:`, err.message);
    return null;
  }
};

module.exports = { getRepoInfo, getRepoTree, getFileContent };
