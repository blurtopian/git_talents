const axios = require('axios');

const CONTRIBUTIONS_API = process.env.CONTRIBUTIONS_API || 'http://localhost:3001';

class ContributionsApi {

  async gradeContrib(repoOwner, repoName, commitHash) {
    const url = `${CONTRIBUTIONS_API}/contrib_ai`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3002'
      };
      const response = await axios.post(url, {
        repoOwner, repoName, commitHash
      }, { headers: headers });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error}`);
    }
  }


  async postSubmissions(submissions) {
    const url = `${CONTRIBUTIONS_API}/submissions`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3002'
      };
      const response = await axios.post(url, {
        submissions
      }, { headers: headers });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error}`);
    }
  }

}

const contributionsApi = new ContributionsApi();
module.exports = {
  contributionsApi,
};
