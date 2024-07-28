const { namespaceWrapper } = require('../namespaceWrapper');
const { gitCommitters } = require('./GitCommitters');
const { searchRandomRepo } = require('./github');


const { talentTask } = require('./TalentTask');
const { committerTask } = require('./CommitterTask');
const { reporterTask } = require('./ReporterTask');
const { pullRequestorTask } = require('./PullRequestorTask');

const fs = require('fs');

class Submission {
  constructor() {}

  async talentTask(round) {
    try {
      console.log('task called with round', round);
      const talent = talentTask.getLatest();
      console.log('talent', talent)
      await namespaceWrapper.insertTalent(talent, round);
      return talent;
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async committerTask(round) {
    try {
      console.log('task called with round', round);
      const committers = committerTask.getLatest();
      console.log('committers', committers)
      const insertedCommitters = await namespaceWrapper.insertCommitters(talent, round);
      return insertedCommitters;
    } catch (err) {
      console.error('ERROR IN COMMITTERS TASK', err);
      return 'ERROR IN COMMITTERS TASK' + err;
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
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchCommittersSubmission(round) {
    console.log('fetchCommittersSubmission called with round', round);
    const committers = await namespaceWrapper.findCommitters(round);
    console.log('committers', committers);
    return committers;
  }

  async submitTalentTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      const submission = await this.fetchTalentSubmission(roundNumber);
      console.log('TALENT SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchTalentSubmission(round) {
    console.log('fetchSubmission called with round', round);
    const talents = await namespaceWrapper.findTalents(round);
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
