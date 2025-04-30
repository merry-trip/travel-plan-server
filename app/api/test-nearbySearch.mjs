// test-scripts/test-nearbySearch.mjs

import axios from 'axios';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

async function testNearbySearch() {
  const context = 'test-nearbySearch';

  try {
    logInfo(context, `📡 NearbySearch API 呼び出し開始（env=${config.env}）`);

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:searchNearby?key=${config.GOOGLE_API_KEY}`,
      {
        locationRestriction: {
          circle: {
            center: {
              latitude: 35.6595,
              longitude: 139.7005
            },
            radius: 1000
          }
        },
        includedTypes: ['tourist_attraction'],
        maxResultCount: 3,
        languageCode: 'en'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
        }
      }
    );

    logInfo(context, '✅ NearbySearch 結果:');
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, `❌ NearbySearch API エラー: ${error.message}`);
    if (error.response?.data) {
      logError(context, `❗ 応答内容: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testNearbySearch();
