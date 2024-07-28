const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { gitCommitters } = require('./GitCommitters');
const { searchRandomRepo } = require('./github');
const fs = require('fs');

class Submission {
  constructor() {}

  async task(round) {
    try {
      console.log('task called with round', round);
      const randomRepo = await searchRandomRepo();
      console.log('randomRepo.clone_url', randomRepo.clone_url)
      gitCommitters.getLatestCommits();
      await gitTask.clone();
      await gitTask.zipRepo();
      const cid = await gitTask.storeFile();
      await gitTask.cleanup();

      await namespaceWrapper.storeSet('cid', cid);
      return 'Done';
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      const submission = await this.fetchSubmission(roundNumber);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchSubmission(round) {
    console.log('fetchSubmission called with round', round);
    const cid = await namespaceWrapper.storeGet('cid');
    console.log('cid', cid);
    return cid;
  }
}

const submission = new Submission();
module.exports = { submission };
