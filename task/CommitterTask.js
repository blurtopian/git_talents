const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token

class CommitterTask {
  constructor(repo) {
    this.repo = repo;
    this.commits = [];
  }

  setRepo(repo) {
    this.repo = repo;
  }

  async getLatest() {
    return await this.getLatestCommits();
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
      this.commits = response.data.items;
      return this.commits;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error.response.status}`);
    }
  }

  async analyze() {
    // Adding a new field `languages` to each object
    const updatedCommits = this.commits.map(commit => {
      // Dynamically add the `languages` field
      commit.languages = this.inferLanguages(commit.files);
      return commit;
    });
    return updatedCommits;
  }


  // Function to infer languages from file extensions
  async inferLanguages(files) {
    const languageMap = {
      'html': 'HTML',
      'css': 'CSS',
      'js': 'JavaScript'
    };
    const languages = new Set();

    files.forEach(file => {
      const ext = file.split('.').pop();
      if (languageMap[ext]) {
        languages.add(languageMap[ext]);
      }
    });

    return Array.from(languages);
  }


  async uploadCommitters(committers) {
    const basePath = await namespaceWrapper.getBasePath();
    const repoName = this.repo.name;
    const cloneDir = `${basePath}/${repoName}`;
    const zipPath = `${cloneDir}.zip`;
    try {
      const client = new KoiiStorageClient();
      const userStaking = await namespaceWrapper.getSubmitterAccount();
      const { cid } = await client.uploadFile(zipPath, userStaking);

      console.log(`Stored file CID: ${cid}`);

      return cid;
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      fs.unlinkSync(`${basePath}/${filename}`);
      throw error;
    }
  }

}

const committerTask = new CommitterTask();
module.exports = {
  committerTask,
};
