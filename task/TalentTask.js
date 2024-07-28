const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('../namespaceWrapper');
const fs = require('fs');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

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
