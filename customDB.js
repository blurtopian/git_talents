const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const Datastore = require('nedb-promises');

class CustomDB {
  #talentsDb;
  #committersDb;
  #reportersDb;
  #pullRequestorsDb;

  constructor() {
    this.initializeDBs();
  }

  async initializeDBs() {
    if (this.#talentsDb
      && this.#committersDb
      && this.#reportersDb
      && this.#pullRequestorsDb
    ) {
      return;
    }

    this.initializeTalentsDB();
    this.initializeCommittersDB();
    this.initializeReportersDB();
    this.initializePullRequestorsDB();
  }


  async initializeTalentsDB() {
    if (this.#talentsDb) {
      return;
    }
    try {
      const basePath = await namespaceWrapper.getBasePath();
      this.#talentsDb = Datastore.create(`${basePath}/talents.db`);
    } catch (e) {
      this.#talentsDb = Datastore.create(`../namespace/${TASK_ID}/talents.db`);
    }
  }

  async initializeCommittersDB() {
    if (this.#committersDb) {
      return;
    }
    try {
      const basePath = await namespaceWrapper.getBasePath();
      this.#committersDb = Datastore.create(`${basePath}/committers.db`);
    } catch (e) {
      this.#committersDb = Datastore.create(`../namespace/${TASK_ID}/committers.db`);
    }
  }

  async initializeReportersDB() {
    if (this.#reportersDb) {
      return;
    }
    try {
      const basePath = await namespaceWrapper.getBasePath();
      this.#reportersDb = Datastore.create(`${basePath}/reporters.db`);
    } catch (e) {
      this.#reportersDb = Datastore.create(`../namespace/${TASK_ID}/reporters.db`);
    }
  }

  async initializePullRequestorsDB() {
    if (this.#pullRequestorsDb) {
      return;
    }
    try {
      const basePath = await namespaceWrapper.getBasePath();
      this.#pullRequestorsDb = Datastore.create(`${basePath}/pullrequestors.db`);
    } catch (e) {
      this.#pullRequestorsDb = Datastore.create(`../namespace/${TASK_ID}/pullrequestors.db`);
    }
  }

  async getTalentsDb() {
    if (this.#talentsDb) return this.#talentsDb;
    await this.initializeTalentsDB();
    return this.#talentsDb;
  }
  async getCommittersDb() {
    if (this.#committersDb) return this.#committersDb;
    await this.initializeCommittersDB();
    return this.#committersDb;
  }
  async getReportersDb() {
    if (this.#reportersDb) return this.#reportersDb;
    await this.initializeReportersDB();
    return this.#reportersDb;
  }
  async getPullRequestorsDb() {
    if (this.#pullRequestorsDb) return this.#pullRequestorsDb;
    await this.initializePullRequestorsDB();
    return this.#pullRequestorsDb;
  }

  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   */
  async insertTalent(talent, roundNumber) {
    try {
      await this.initializeTalentsDB();
      const newDoc = await this.#talentsDb.insert({ ...talent, round });
      return newDoc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   */
  async getTalent(_id) {
    try {
      await this.initializeTalentsDB();
      const resp = await this.#talentsDb.findOne({ _id });
      if (resp) {
        return resp;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   */
  async findTalents(round) {
    try {
      await this.initializeTalentsDB();
      const resp = await this.#talentsDb.find({ round });
      if (resp) {
        return resp;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   */
  async insertCommitters(committers, round) {
    try {
      await this.initializeCommittersDB();
      let committersWithRound = committers.map(committer => {
        committer.round = round;
        return committer;
      });
      const newDocs = await this.#committersDb.insertMany(committersWithRound);
      return newDocs;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   */
  async findCommitters(round) {
    try {
      await this.initializeCommittersDB();
      const resp = await this.#committersDb.find({ round });
      if (resp) {
        return resp;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

}



const customDB = new CustomDB();
module.exports = {
  customDB,
};