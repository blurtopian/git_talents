const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token

class TalentTask {
  constructor(repo) {
    this.repo = repo;
  }

  setRepo(repo) {
    this.repo = repo;
  }

  async getLatest() {
    try {
      // TODO;
      return { message: 'Not yet implemented.' };
    } catch (error) {
      console.error('Error getting latest:', error);
    } finally {
      // Clean up: remove the temporary directory if needed
      // (Implement cleanup logic here if desired)
    }
  }

}

const talentTask = new TalentTask();
module.exports = {
  talentTask,
};
