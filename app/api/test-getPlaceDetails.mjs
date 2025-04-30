// test-scripts/test-getPlaceDetails.mjs

import axios from 'axios';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '@/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

async function testGetPlaceDetails() {
  const context = 'test-getPlaceDetails';

  try {
    const placeId = 'ChIJF2HRSKiMGGAR1qOAPQK1yko'; // まんだらけ渋谷店

    logInfo(context, `📨 詳細取得開始（env=${config.env}） → placeId="${placeId}"`);

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}?key=${config.GOOGLE_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': '*' // 実運用では必要なフィールドに絞る
        }
      }
    );

    logInfo(context, '✅ PlaceDetails 結果:');
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, `❌ APIエラー: ${error.message}`);
    if (error.response?.data) {
      logError(context, `❗ 応答内容: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testGetPlaceDetails();
