const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.the-odds-api.com/v4/sports/tennis/events';

async function getMatchOdds(player1, player2) {
  const params = {
    apiKey: process.env.THEODDS_API_KEY,
    regions: 'us',
    markets: 'h2h',
    bookmakers: 'hardrock'
  };

  try {
    const { data } = await axios.get(BASE_URL, { params });
    // Filter events matching players (simplified)
    const match = data.find(
      (event) => event.home_team.includes(player1) && event.away_team.includes(player2)
    );
    return match || null;
  } catch (err) {
    console.error('Error fetching odds', err.message);
    return null;
  }
}

module.exports = { getMatchOdds };
