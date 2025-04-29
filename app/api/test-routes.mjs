// test-scripts/test-routes.mjs

import axios from 'axios';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境明示（APIキー安全）

const context = 'getRoute';

async function getUserCountry() {
  try {
    const res = await axios.get('https://ipapi.co/json/');
    const countryCode = res.data.country;
    logInfo('getUserCountry', `🌍 検出された国コード: ${countryCode}`);
    return countryCode;
  } catch (error) {
    logError('getUserCountry', `❌ 国コード取得失敗: ${error.message}`);
    return 'JP'; // デフォルトは日本
  }
}

async function getRoute() {
  try {
    const userCountry = await getUserCountry();
    const imperialCountries = ['US', 'LR', 'MM'];
    const units = imperialCountries.includes(userCountry) ? 'IMPERIAL' : 'METRIC';
    logInfo(context, `📏 使用する単位: ${units}`);

    const origin = { location: { latLng: { latitude: 35.690921, longitude: 139.700257 } } }; // 新宿駅
    const destination = { location: { latLng: { latitude: 35.729503, longitude: 139.710906 } } }; // 池袋駅
    const travelMode = 'TRANSIT';
    const languageCode = 'en';

    const departureTime = {
      seconds: Math.floor((Date.now() + 30 * 60 * 1000) / 1000)
    };

    const requestBody = {
      origin,
      destination,
      travelMode,
      languageCode,
      units,
      departureTime,
      transitPreferences: {
        allowedTravelModes: ['BUS', 'RAIL', 'TRAIN']
      }
    };

    logInfo(context, '🚦 Routes API リクエスト開始...');

    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': config.GOOGLE_API_KEY,
          'X-Goog-FieldMask': '*'
        }
      }
    );

    const data = response.data;

    if (!data.routes || data.routes.length === 0) {
      logInfo(context, '⚠️ routes は空です。ルートが見つかりませんでした。');
    } else {
      logInfo(context, '✅ ルート取得成功！');
      logInfo(context, JSON.stringify(data.routes[0], null, 2));
    }
  } catch (error) {
    logError(context, `❌ API呼び出し失敗: ${error.message}`);
    if (error.response?.data) {
      logError(context, `❗ 応答詳細: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

getRoute();
