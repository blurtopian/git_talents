const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const task = require('./task');

class CoreLogic {
  async task(round) {
    const result = await task.submission.committersTask(round);
    return result;
  }

  async submitTask(round) {
    const talentsSubmission = await task.submission.submitTalentTask(round);
    return talentsSubmission;
  }

  async auditTask(round) {
    await task.audit.auditTask(round);
  }

  async selectAndGenerateDistributionList(
    round,
    isPreviousRoundFailed = false,
  ) {
    await namespaceWrapper.selectAndGenerateDistributionList(
      task.distribution.submitDistributionList,
      round,
      isPreviousRoundFailed,
    );
  }

  async auditDistribution(round) {
    await task.distribution.auditDistribution(round);
  }
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
