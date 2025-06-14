const axios = require('axios');
require('dotenv').config();

const API_HOST = 'api-football-v1.p.rapidapi.com';

async function getMatchStats(player1, player2) {
  const options = {
    method: 'GET',
    url: `https://${API_HOST}/v3/tennis/headToHead`,
    params: { player1, player2 },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (err) {
    console.error('Error fetching tennis stats', err.message);
    return null;
  }
}

async function getUpcomingMatches() {
  const options = {
    method: 'GET',
    url: `https://${API_HOST}/v3/tennis/fixtures`,
    params: { next: 10 },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };
  try {
    const { data } = await axios.request(options);
    return data?.response || [];
  } catch (err) {
    console.error('Error fetching upcoming matches', err.message);
    return [];
  }
}

module.exports = { getMatchStats, getUpcomingMatches };
