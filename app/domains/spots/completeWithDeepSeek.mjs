// app/domains/spots/completeWithDeepSeek.mjs

import { logInfo, logError } from '../../utils/logger.mjs'; // ✅ 正しいimport方法
import config from '../../config.mjs'; // ✅ config導入

const context = 'completeWithDeepSeek';

const API_KEY = config.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * DeepSeek API を使って説明文と旅行ヒントを自動生成する
 * @param {Object} spot - 対象スポット
 * @returns {Object} - 説明文と tip を補完したスポットオブジェクト
 */
export async function completeWithDeepSeek(spot) {
  const prompt = `
You are a professional travel writer specializing in Japanese pop culture.
Write for international travelers who are anime fans visiting Japan.

Generate:
- a concise English *description* of the spot (max 200 characters), focusing on its appeal to anime/manga fans.
- a practical *short travel tip* (max 200 characters), especially useful for foreign visitors.

Use this format:
- description: ...
- short_tip_en: ...

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
    logInfo(context, `🔁 Requesting DeepSeek for: ${spot.name}`);

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
    logInfo(context, `✍️ DeepSeek response: ${reply}`);

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
    logError(context, `❌ DeepSeek error for ${spot.name}: ${err.message}`);
    return {
      ...spot,
      ai_description_status: 'failed'
    };
  }
}
