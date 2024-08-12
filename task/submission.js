const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { getRandomRepo } = require('./github');


const { talentTask } = require('./TalentTask');
const { CommitterTask } = require('./CommitterTask');

const fs = require('fs');

class Submission {
  constructor() {}

  async committersTask(round) {
    let taskResult = undefined;
    try {
      console.log('task called with round', round);
      const repo = await getRandomRepo();
      console.log('repo', repo);

      if (repo) {
        const task = new CommitterTask(repo); 
        const commits = await task.getLatestCommits();
        console.log('commits.length', commits.length);
        console.log('commit[0]', commits[0]);

        const analysisResult = await task.analyze();
        console.log('analysisResult.length', analysisResult.length);

        const persistResult = await task.persistResult(round);
        console.log('persistResult', persistResult);

        // TODO: store/upload result to IPFS
        //const cid = await committerTask.storeResult(round);

        taskResult = { result: persistResult };
      }
    } catch (err) {
      console.error('ERROR IN COMMITTERS TASK', err);
      return 'ERROR IN COMMITTERS TASK' + err;
    }

    return taskResult;
  }

  async talentTask(round) {
    try {
      console.log('task called with round', round);
      const talent = talentTask.getLatest();
      console.log('talent', talent)
      //await namespaceWrapper.insertTalent(talent, round);
      return talent;
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async reporterTask(round) {
    try {
      return 'TODO: Report Task';
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async pullRequestorTask(round) {
    try {
      return 'TODO: Pull Requestor Task';
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async submitCommittersTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      const submission = await this.fetchCommittersSubmission(roundNumber);
      console.log('COMMITTERS SUBMISSION', submission);
      // await namespaceWrapper.checkSubmissionAndUpdateRound(
      //   submission,
      //   roundNumber,
      // );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchCommittersSubmission(round) {
    console.log('fetchCommittersSubmission called with round', round);
    //const committers = await namespaceWrapper.findCommitters(round);
    const committers = [];
    console.log('committers', committers);
    return committers;
  }

  async submitTalentTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      //const submission = await this.fetchTalentSubmission(roundNumber);
      const submission = [];
      console.log('TALENT SUBMISSION', submission);
      // await namespaceWrapper.checkSubmissionAndUpdateRound(
      //   submission,
      //   roundNumber,
      // );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchTalentSubmission(round) {
    console.log('fetchSubmission called with round', round);
    //const talents = await namespaceWrapper.findTalents(round);
    const talents = [];
    console.log('talents', talents);
    return talents;
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
