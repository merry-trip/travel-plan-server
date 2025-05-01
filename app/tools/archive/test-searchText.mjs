// app/tools/archive/test-searchText.mjs

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger.mjs';

// ✅ __dirname 再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ .env ファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY_DEV;

async function searchText() {
  const query = 'Animate Akihabara';

  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: query
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.websiteUri'
        }
      }
    );

    const spot = response.data.places?.[0];
    if (!spot) {
      logError('searchText', `❌ スポットが取得できませんでした（query: ${query}）`);
      return;
    }

    console.log('⭐ 取得スポット（1件目）');
    console.log(JSON.stringify(spot, null, 2));
  } catch (err) {
    logError('searchText', err.message);
    if (err.response?.data) {
      console.error(JSON.stringify(err.response.data, null, 2));
    }
  }
}

searchText();
