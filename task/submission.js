const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { getRandomRepo } = require('./github');
const { repoTask } = require('./RepoTask');
const { customDB } = require('../customDB');

const fs = require('fs');

class Submission {
  constructor() {}

  async repoTask(round) {
    let isSuccess = false;
    try {
      console.log('task called with round', round);
      const repo = await getRandomRepo();
      console.log('repo', repo);

      if (repo) {
        repoTask.setRepo(repo); 
        const commits = await repoTask.getCommits();
        console.log('commits.length', commits.length);
        console.log('commit[0]', commits[0]);

        const analysisResult = await repoTask.analyze();
        console.log('analysisResult.length', analysisResult.length);

        const persistResult = await repoTask.persistResult(round);
        console.log('persistResult', persistResult);

        const postResultCid = await repoTask.postResults(round);
        console.log('postResultCid', postResultCid)

        isSuccess = true;
      }
    } catch (err) {
      console.error('ERROR IN COMMITTERS TASK', err);
      return 'ERROR IN COMMITTERS TASK' + err;
    }

    return isSuccess;
  }

  async fetchSubmission(round) {
    console.log('fetchSubmission called with round', round);
    const _id = await namespaceWrapper.storeGet(round);
    console.log('_id', _id);
    return _id;
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


}

const submission = new Submission();
module.exports = { submission };
