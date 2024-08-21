const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { customDB } = require('../customDB');

const axios = require('axios');
const archiver = require('archiver');

const fs = require('fs');
const languageMap = require('../constants/languageMap');
const dateutil = require('../utils/dateutil');
const { contributionsApi } = require('./ContributionsApi');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token

class RepoTask {
  setRepo(repo) {
    this.repo = repo;
    this.commits = [];
    this.analysisResult = [];
  }

  async getCommits() {
    console.log('repo', this.repo)
    const owner = this.repo.owner.login;
    const repoName = this.repo.name;

    const searchCommitsUrl = `${GITHUB_API_URL}/repos/${owner}/${repoName}/commits`;
    console.log('searchCommitsUrl', searchCommitsUrl)
    const params = {
      sort: 'committer-date',
      order: 'desc',
    };
  
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json', // This header is required for the commits search endpoint
    };
  
    try {
      const response = await axios.get(searchCommitsUrl, { headers, params });
      this.commits = response.data;
      return this.commits;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error}`);
    }
  }

  async analyze() {
    if (!this.commits || this.commits.length <= 0) {
      return [];
    }
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json', // This header is required for the commits search endpoint
    };

    // Array to hold promises for fetching repo details
    const commitPromises = this.commits.map(commit => axios.get(commit.url, { headers }));

    // Resolve all promises to get repo details
    const commitResponses = await Promise.all(commitPromises);
    console.log('commitResponses.length', commitResponses.length)
    console.log('commitResponses[0].data', commitResponses[0].data)

    for (let i = 0; i < commitResponses.length; i++) {
      let commit = commitResponses[i].data;
      console.log('commit.url', commit.url)

      console.log('commit.files.length', commit.files.length)
      if (commit.files.length <= 0) {
        continue;
      }
      try {
        const languages = await this.inferLanguages(commit.files);
        if (languages && languages.length > 0) {
          commit.languages = languages;
        }

        const owner = this.repo.owner.login;
        const repo = this.repo.name;
        const hash = commit.sha;

        console.log('gradeContrib params', {owner, repo, hash})
        const grade = await contributionsApi.gradeContrib(owner, repo, hash);

        if (grade) {
          commit.grade = grade;
  
          const returnObj = {
            author: commit.author.login,
            hash: commit.sha,
            languages: languages,
            grade: grade,
            // optional info
            author_id: commit.author.id,
            author_url: commit.author.url,
            repo:  {
              name: this.repo.name,
              url: this.repo.url,
            }
          }
  
          this.analysisResult.push(returnObj);
        }
      } catch(err) {
        console.log(err.message);
      } finally {
        continue;
      }
    }

    return this.analysisResult;
  }


  // Function to infer languages from file extensions
  async inferLanguages(files) {
    const languages = new Set();
    files.forEach(file => {
      const ext = file.filename.split('.').pop();
      if (languageMap[ext]) {
        languages.add(languageMap[ext]);
      }
    });

    return Array.from(languages);
  }

  async persistResult(round) {
    if (!this.analysisResult || this.analysisResult.length <= 0) {
      return 0;
    }
    const committersDb = await customDB.getCommittersDb();
    try {
      const persistContribs = this.analysisResult.map(item => {
        return {
          source: 'github',
          id: item.sha,
          type: 'commit',
          grade: item.grade,
          hash: item.sha,
          author: item.author,
          committer: item.committer,
          repo: item.repo,
        };
      });
      const dbValue = {
        _id: round,
        round,
        contributions: persistContribs
      }
      const result = await committersDb.insert(
        dbValue
      );
      console.log('result', result);
      return dbValue;
    } catch(err) {
      console.log('persistResult err', err)
    }
  }

  async postResults(round) {
    const committersDb = await customDB.getCommittersDb();
    try {
      const contributions = await committersDb.find({ _id: round});
      console.log('retrieved db contributions', contributions);

      const _id = contributionsApi.postSubmissions(contributions);
      console.log('_id', _id);

      await namespaceWrapper.storeSet(round, _id);
    } catch(err) {
      console.log('postResults err', err)
    }
  }

  async purgeDb() {
    console.log('purgeDb')
    const committersDb = await customDB.getCommittersDb();
    try {
      await committersDb.remove({}, { multi: true });
    } catch(err) {
      console.log('purgeDB err', err)
    }
  }

  async storeResult(round) {
    const taskLevelDbPath = await namespaceWrapper.getTaskLevelDBPath();
    const basePath = taskLevelDbPath.replace('/KOIIDB', '');
    const timestamp = dateutil.getTimestamp();
    const zipPath = `${basePath}/${timestamp}.zip`;

    // Write the data to a temp file
    fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

    try {
      const client = new KoiiStorageClient();
      const userStaking = await namespaceWrapper.getSubmitterAccount();
      const { cid } = await client.uploadFile(zipPath, userStaking);
      console.log(`Stored file CID: ${cid}`);

      return cid;
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      fs.unlinkSync(zipPath);
      throw error;
    }
  }

}

const repoTask = new RepoTask();
module.exports = {
  repoTask,
};
