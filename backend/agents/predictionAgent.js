const { openai } = require('../services/openaiService');

async function runPredictionAgent(summary, odds) {
  const prompt = `Based on this summary:\n${summary}\n\nOdds:\nPlayer 1: ${odds.player1}\nPlayer 2: ${odds.player2}\n\nEstimate win probabilities. Recommend a value bet. Return as JSON:\n{\n  "win_prob_player1": number,\n  "win_prob_player2": number,\n  "value_bet": "string",\n  "confidence_level": "Low | Medium | High"\n}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error('Error parsing prediction response', err.message);
    return null;
  }
}

module.exports = { runPredictionAgent };
