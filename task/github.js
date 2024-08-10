const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token
const REPO_KEYWORD = process.env.REPO_KEYWORD || 'random'; // You can change this to any keyword you like
const MAX_REPO_SIZE_BYTES = 10 * 1024 * 1024; // Example condition: 100 MB

async function getRandomRepo() {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/search/repositories`,
      {
        headers: {
          Authorization: `token ${ACCESS_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          q: REPO_KEYWORD,
          sort: 'updated',
          order: 'desc'
        }
      },
    );

    if (response.status != 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = response.data;
    const repositories = data.items;

    if (repositories && repositories.length > 0) {
      let foundRepo = false;

      while (!foundRepo) {
        const randomIndex = Math.floor(Math.random() * repositories.length);
        const randomRepo = repositories[randomIndex];
         // Remove the selected repository from the list
        repositories.splice(randomIndex, 1);

        // Size is returned in KB, convert to bytes
        const repoSizeBytes = randomRepo.size * 1024;
        console.log(`Repository: ${randomRepo.full_name}, Size: ${repoSizeBytes} bytes`);

        if (repoSizeBytes <= MAX_REPO_SIZE_BYTES) {
          return randomRepo;
        } else {
          console.log(`Repository ${repo.full_name} is too large to archive.`);
          continue;
        }
      }

    } else {
      console.log('No repositories found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  getRandomRepo,
};
