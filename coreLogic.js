const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const task = require('./task');

class CoreLogic {
  async task(round, models) {
    const result = await task.submission.committersTask(round, models);
    return result;
  }

  async submitTask(round, models) {
    const talentsSubmission = await task.submission.submitTalentTask(round, models);
    return talentsSubmission;
  }

  async auditTask(round, models) {
    await task.audit.auditTask(round, models);
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
