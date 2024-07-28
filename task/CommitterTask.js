const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('../namespaceWrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

class CommitterTask {
  constructor(repo) {
    this.repo = repo;
  }

  setRepo(repo) {
    this.repo = repo;
  }

  async getLatest() {
    const commits = await this.getLatestCommits();
    return commits;
  }

  async getLatestCommits() {
    const searchCommitsUrl = `${GITHUB_API_URL}/search/commits`;
    const params = {
      q: 'sort:committer-date-desc',
    };
  
    const headers = {
      Authorization: `token ${ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.cloak-preview', // This header is required for the commits search endpoint
    };
  
    try {
      const response = await axios.get(searchCommitsUrl, { headers, params });
      const commits = response.data.items;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error.response.status}`);
    }

  }

}

const committerTask = new CommitterTask();
module.exports = {
  committerTask,
};
