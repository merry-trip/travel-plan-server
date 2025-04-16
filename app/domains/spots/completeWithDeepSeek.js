// app/domains/spots/completeWithDeepSeek.js
const fetch = require('node-fetch');
const logger = require('../../utils/logger');

const context = 'completeWithDeepSeek';

const API_KEY =
  process.env.APP_ENV === 'prod'
    ? process.env.DEEPSEEK_API_KEY_PROD
    : process.env.DEEPSEEK_API_KEY_DEV;

const API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function completeWithDeepSeek(spot) {
  const prompt = `
You are a professional travel writer.
Generate a concise English description (max 200 characters) and a travel tip for the following place:

Name: ${spot.name}
Category: ${spot.primary_type || spot.types?.[0] || 'General Spot'}

Return in this format:
- description: ...
- short_tip_en: ...
`.trim();

  const body = {
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  };

  try {
    logger.logInfo(context, `🔁 Requesting DeepSeek for: ${spot.name}`);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();

    const reply = json.choices?.[0]?.message?.content || '';
    logger.logInfo(context, `✍️ DeepSeek response: ${reply}`);

    const lines = reply.split('\n').filter(Boolean);

    const description = lines.find(line => line.toLowerCase().includes('description'))?.split(':')[1]?.trim() || '';
    const short_tip_en = lines.find(line => line.toLowerCase().includes('tip'))?.split(':')[1]?.trim() || '';

    return {
      ...spot,
      description,
      short_tip_en,
      ai_description_status: 'done'
    };
  } catch (err) {
    logger.logError(context, `❌ DeepSeek error for ${spot.name}: ${err.message}`);
    return {
      ...spot,
      ai_description_status: 'failed'
    };
  }
}

module.exports = completeWithDeepSeek;
