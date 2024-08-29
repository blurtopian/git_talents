const { coreLogic } = require('./coreLogic');
const {
  namespaceWrapper,
  taskNodeAdministered,
  app,
} = require('@_koii/namespace-wrapper');

const { getRandomRepo } = require('./task/github');
const { submission } = require('./task/submission');
const { repoTask } = require('./task/RepoTask');
const { audit } = require('./task/audit');
const { customDB } = require('./customDB');

if (app) {
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState();
    console.log('TASK STATE HERE', state);
    res.status(200).json({ taskState: state });
  });

  app.get('/value', async (req, res) => {
    const value = await namespaceWrapper.storeGet('value');
    console.log('value HERE', value);
    res.status(200).json({ value: value });
  });

  app.get('/random_repo', async (req, res) => {
    await getRandomRepo();
    res.status(200).json({ data: 'none' });
  });

  app.post('/repo_task', async (req, res) => {
    let result = await submission.repoTask(0);
    res.status(200).json({ result });
  });

  app.post('/submit', async (req, res) => {
    let result = await submission.submitTask(0);
    res.status(200).json({ result });
  });

  app.post('/repo_task_post_results', async (req, res) => {
    console.log('committers req.query', req.query);
    const { round } = req.query;
    console.log('repo_task_post_results req', req);
    let _id = await repoTask.postResults(round);
    res.status(200).json({ result: _id });
  });

  app.post('/committers_audit', async (req, res) => {
    let result = await audit.auditTask(0);
    res.status(200).json({ result });
  });

  app.get('/committers', async (req, res) => {
    console.log('committers req.query', req.query);
    const committersDb = await customDB.getCommittersDb();
    const committers = await committersDb.find({});
    res.status(200).json({ result: committers });
  });

  app.delete('/committers_purge', async (req, res) => {
    const committersDb = await customDB.getCommittersDb();
    const result =  await committersDb.remove({}, { multi: true });
    res.status(200).json({ result: `Purge Done! ${result}` });
  });

}

async function setup() {
  /*######################################################
  ################## DO NOT EDIT BELOW #################
  ######################################################*/
  await namespaceWrapper.defaultTaskSetup();
  process.on('message', m => {
    console.log('CHILD got message:', m);
    if (m.functionCall == 'submitPayload') {
      console.log('submitPayload called');
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == 'auditPayload') {
      console.log('auditPayload called');
      coreLogic.auditTask(m.roundNumber);
    } else if (m.functionCall == 'executeTask') {
      console.log('executeTask called');
      coreLogic.task(m.roundNumber);
    } else if (m.functionCall == 'generateAndSubmitDistributionList') {
      console.log('generateAndSubmitDistributionList called');
      coreLogic.selectAndGenerateDistributionList(m.roundNumber, m.isPreviousRoundFailed);
    } else if (m.functionCall == 'distributionListAudit') {
      console.log('distributionListAudit called');
      coreLogic.auditDistribution(m.roundNumber);
    }
  });
  /*######################################################
  ################ DO NOT EDIT ABOVE ###################
  ######################################################*/

  /* GUIDE TO CALLS K2 FUNCTIONS MANUALLY

      If you wish to do the development by avoiding the timers then you can do the intended calls to K2
      directly using these function calls.

      To disable timers please set the TIMERS flag in task-node ENV to disable

      NOTE : K2 will still have the windows to accept the submission value, audit, so you are expected
      to make calls in the intended slots of your round time.

  */

  // Get the task state
  // console.log(await namespaceWrapper.getTaskState());

  // Get round
  // const round = await namespaceWrapper.getRound();
  // console.log("ROUND", round);

  // Call to do the work for the task
  // await coreLogic.task();

  // Submission to K2 (Preferablly you should submit the cid received from IPFS)
  // await coreLogic.submitTask(round - 1);

  // Audit submissions
  // await coreLogic.auditTask(round - 1);

  // Upload distribution list to K2
  // await coreLogic.selectAndGenerateDistributionList(10);

  // Audit distribution list
  // await coreLogic.auditDistribution(round - 2);

  // Payout trigger
  // const responsePayout = await namespaceWrapper.payoutTrigger();
  // console.log("RESPONSE TRIGGER", responsePayout);

  // Logs to be displayed on desktop-node
  // namespaceWrapper.logger('error', 'Internet connection lost');
  // await namespaceWrapper.logger('warn', 'Stakes are running low');
  // await namespaceWrapper.logger('log', 'Task is running');
}

if (taskNodeAdministered) {
  setup();
}
