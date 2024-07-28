const { namespaceWrapper } = require('./namespaceWrapper');
const task = require('./task');

class CoreLogic {
  async task(round) {
    const result = await task.submission.committerTask(round);
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
