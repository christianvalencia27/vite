const express = require('express');
const router = express.Router();

const { getUpcomingMatches, getMatchStats } = require('../services/apiFootballService');
const { getMatchOdds } = require('../services/theOddsService');
const { runMatchAnalyst } = require('../agents/matchAnalyst');
const { runPredictionAgent } = require('../agents/predictionAgent');
const { runExplainerAgent } = require('../agents/explainerAgent');

function calcImpliedProb(odd) {
  return odd ? 1 / odd : null;
}

router.get('/', async (_req, res) => {
  try {
    const matches = await getUpcomingMatches();
    const results = [];

    for (const m of matches) {
      try {
        const player1 = m?.players?.[0]?.name || m?.player1 || m?.teams?.home?.name;
        const player2 = m?.players?.[1]?.name || m?.player2 || m?.teams?.away?.name;
        if (!player1 || !player2) continue;

        const stats = await getMatchStats(player1, player2);
        const oddsData = await getMatchOdds(player1, player2);
        let odds;
        if (oddsData && oddsData.bookmakers?.[0]?.markets?.[0]?.outcomes) {
          const [home, away] = oddsData.bookmakers[0].markets[0].outcomes;
          odds = { player1: home.price, player2: away.price };
        }

        const summary = await runMatchAnalyst(
          { player1: stats?.player1, player2: stats?.player2 },
          m,
        );
        const prediction = await runPredictionAgent(summary, odds);
        const explanation = await runExplainerAgent(summary, prediction);

        results.push({
          players: { player1, player2 },
          summary,
          prediction,
          explanation,
          impliedOdds: {
            player1: calcImpliedProb(odds?.player1),
            player2: calcImpliedProb(odds?.player2),
          },
        });
      } catch (loopErr) {
        console.error('Error processing match', loopErr.message);
      }
    }

    results.sort((a, b) => (b.prediction?.confidence || 0) - (a.prediction?.confidence || 0));
    res.json(results);
  } catch (err) {
    console.error('Error handling /best-bets request', err.message);
    res.status(500).json({ error: 'Failed to fetch best bets' });
  }
});

module.exports = router;
