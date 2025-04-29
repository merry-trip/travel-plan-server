// test-scripts/test-autocomplete.mjs

import axios from 'axios';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境フラグを明示

async function testAutocomplete() {
  const context = 'test-autocomplete';

  try {
    logInfo(context, `📨 Autocompleteリクエスト送信中（env=${config.env}）`);

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete?key=${config.GOOGLE_API_KEY}`,
      {
        input: 'mandarake sh',
        languageCode: 'en',
        regionCode: 'JP'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': '*'
        }
      }
    );

    logInfo(context, '✅ Autocomplete結果:');
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, `❌ Autocompleteエラー: ${error.message}`);
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAutocomplete();
