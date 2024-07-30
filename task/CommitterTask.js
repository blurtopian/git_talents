const axios = require('axios');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const git = simpleGit();

const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const fs = require('fs');
const languageMap = require('../constants/languageMap');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token

class CommitterTask {
  constructor() {
    this.commits = [];
  }

  async getLatest() {
    return await this.getLatestCommits();
  }

  async getLatestCommits() {
    const searchCommitsUrl = `${GITHUB_API_URL}/search/commits`;
    const params = {
      q: 'a', // Empty query to get all commits
      sort: 'committer-date',
      order: 'desc',
      per_page: 3 // Number of commits to fetch per page
    };
  
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json', // This header is required for the commits search endpoint
    };
  
    try {
      const response = await axios.get(searchCommitsUrl, { headers, params });
      this.commits = response.data.items;
      return this.commits;
    } catch (error) {
      console.error(`Failed to fetch commits: ${error.response}`);
    }
  }

  async analyze() {
    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json', // This header is required for the commits search endpoint
    };

    // Array to hold promises for fetching repo details
    const repoDetailPromises = this.commits.map(commit => axios.get(commit.repository.url, { headers }));

    // Resolve all promises to get repo details
    const repoDetails = await Promise.all(repoDetailPromises);

    // Filter commits from public repositories
    const publicCommits = this.commits.filter((commit, index) => !repoDetails[index].data.private);

    publicCommits.forEach(commit => {
      console.log(`Commit URL: ${commit.url}`);
      console.log('-------------------------------------');
    });

    const updatedCommits = [];
    const commitHeaders = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    };

    for (let i = 0; i < publicCommits.length; i++) {
      let commit = publicCommits[i];

      try {
        const commitResp = await axios.get(commit.url, { commitHeaders });
        commit.languages = await this.inferLanguages(commitResp.data.files);
        console.log('commit.languages', commit.languages)
        updatedCommits.push(commit);
      } catch(err) {
        console.log(err.message);
      } finally {
        continue;
      }
    }

    return updatedCommits;
  }


  // Function to infer languages from file extensions
  async inferLanguages(files) {
    const languages = new Set();

    files.forEach(file => {
      console.log('file.filename', file.filename)
      const ext = file.filename.split('.').pop();
      console.log('ext', ext)
      if (languageMap[ext]) {
        languages.add(languageMap[ext]);
      }
    });

    return Array.from(languages);
  }


  async uploadCommitters(committers) {
    const basePath = await namespaceWrapper.getBasePath();
    const repoName = this.repo.name;
    const cloneDir = `${basePath}/${repoName}`;
    const zipPath = `${cloneDir}.zip`;
    try {
      const client = new KoiiStorageClient();
      const userStaking = await namespaceWrapper.getSubmitterAccount();
      const { cid } = await client.uploadFile(zipPath, userStaking);

      console.log(`Stored file CID: ${cid}`);

      return cid;
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      fs.unlinkSync(`${basePath}/${filename}`);
      throw error;
    }
  }

}

const committerTask = new CommitterTask();
module.exports = {
  committerTask,
};
