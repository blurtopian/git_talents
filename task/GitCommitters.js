const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('../namespaceWrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;


class GitCommitters {
  constructor(repo) {
    this.repo = repo;
  }

  setRepo(repo) {
    this.repo = repo;
  }

  async getLatestCommits() {
    try {
      // Clone the repository to a temporary directory (or just use a local repo)
      await git.clone(remoteUrl, 'temp-repo', ['--depth', '1']);

      // Change the working directory to the cloned repository
      git.cwd('temp-repo');

      // Get the latest commit
      const log = await git.log({ maxCount: 1 });
      console.log('Latest Commit:', log.latest);
      return log.latest;
    } catch (error) {
      console.error('Error fetching latest commit:', error);
    } finally {
      // Clean up: remove the temporary directory if needed
      // (Implement cleanup logic here if desired)
    }
  }

  fetchLatestCommits = async () => {
    const searchCommitsUrl = `${GITHUB_API_URL}/search/commits`;
    const params = {
      q: 'sort:committer-date-desc',
    };
  
    const headers = {
      Authorization: `token ${ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.cloak-preview', // This header is required for the commits search endpoint
    };
  
    try {
      const response = await axios.get(url, { headers, params });
      const commits = response.data.items;
      commits.forEach(commit => {
        console.log(commit.commit.message);
      });
    } catch (error) {
      console.error(`Failed to fetch commits: ${error.response.status}`);
    }
  };

}

const gitCommitters = new GitCommitters();
module.exports = {
  gitCommitters,
};
