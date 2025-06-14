const { openai } = require('../services/openaiService');

async function runMatchAnalyst(playerStats, matchContext) {
  const prompt = `You are a tennis expert. Summarize this matchup in 3-4 sentences using the data:\n\nPlayer 1:\n${playerStats.player1}\n\nPlayer 2:\n${playerStats.player2}\n\nMatch Context:\n${matchContext}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { runMatchAnalyst };
