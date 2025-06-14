const { openai } = require('../services/openaiService');

async function runExplainerAgent(summary, prediction) {
  const prompt = `Summary:\n${summary}\nPrediction:\n${JSON.stringify(prediction)}\n\nWrite a 2-3 sentence explanation for the betting recommendation.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo'
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { runExplainerAgent };
