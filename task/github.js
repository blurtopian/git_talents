const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token
const MIN_REPO_SIZE_BYTES = 1 * 1024 * 1024; // Example condition: 1 MB

async function getRandomRepo() {
  console.log('getRandomRepo-1');
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/search/repositories`,
      {
        headers: {
          Authorization: `token ${ACCESS_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          q: 'is:public',
          sort: 'updated',
          order: 'desc'
        }
      },
    );
    console.log('getRandomRepo-2');

    if (response.status != 200) {
      console.log('getRandomRepo-3');
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = response.data;
    const repositories = data.items;
    console.log('getRandomRepo-4::repositories.length', repositories.length);

    if (repositories && repositories.length > 0) {
      console.log('getRandomRepo-5');
      let foundRepo = false;

      while (!foundRepo) {
        console.log('getRandomRepo-6');
        const randomIndex = Math.floor(Math.random() * repositories.length);
        const randomRepo = repositories[randomIndex];
         // Remove the selected repository from the list
        repositories.splice(randomIndex, 1);

        // Size is returned in KB, convert to bytes
        const repoSizeBytes = randomRepo.size * 1024;

        if (repoSizeBytes >= MIN_REPO_SIZE_BYTES) {
          console.log('getRandomRepo-7');
          return randomRepo;
        } else {
          console.log('getRandomRepo-8-continue');
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
