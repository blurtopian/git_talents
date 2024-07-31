const axios = require('axios');

const CONTRIB_AI_API = process.env.CONTRIB_AI_API || 'http://localhost:3001';

class ContribAi {

  async gradeContrib(repoOwner, repoName, commitHash) {
    const contribAiUrl = `${CONTRIB_AI_API}/contrib_ai`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3001'
      };
      const response = await axios.post(contribAiUrl, {
        repoOwner, repoName, commitHash
      }, { headers: headers });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error}`);
    }
  }

  
}

const contribAi = new ContribAi();
module.exports = {
  contribAi,
};
