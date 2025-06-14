const express = require('express');
const router = express.Router();

const { getMatchStats } = require('../services/apiFootballService');
const { getMatchOdds } = require('../services/theOddsService');
const { runMatchAnalyst } = require('../agents/matchAnalyst');
const { runPredictionAgent } = require('../agents/predictionAgent');
const { runExplainerAgent } = require('../agents/explainerAgent');

function calcImpliedProb(odd) {
  return odd ? 1 / odd : null;
}

router.post('/', async (req, res) => {
  try {
    const { player1, player2, matchContext, playerStats, odds } = req.body || {};

    if (!playerStats && (!player1 || !player2)) {
      return res.status(400).json({ error: 'Player names or stats required' });
    }

    let stats = playerStats;
    if (!stats && player1 && player2) {
      stats = await getMatchStats(player1, player2);
    }

    let matchOdds = odds;
    if (!matchOdds && player1 && player2) {
      const match = await getMatchOdds(player1, player2);
      if (match && match.bookmakers?.[0]?.markets?.[0]?.outcomes) {
        const [home, away] = match.bookmakers[0].markets[0].outcomes;
        matchOdds = {
          player1: home.price,
          player2: away.price,
        };
      }
    }

    const summary = await runMatchAnalyst(
      { player1: stats?.player1, player2: stats?.player2 },
      matchContext,
    );
    const prediction = await runPredictionAgent(summary, matchOdds);
    const explanation = await runExplainerAgent(summary, prediction);

    const implied = {
      player1: calcImpliedProb(matchOdds?.player1),
      player2: calcImpliedProb(matchOdds?.player2),
    };

    res.json({ summary, prediction, explanation, impliedOdds: implied });
  } catch (err) {
    console.error('Error handling /predict request', err.message);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

module.exports = router;
