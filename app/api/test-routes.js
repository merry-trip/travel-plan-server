const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GOOGLE_API_KEY;

// IPから国コードを取得する関数
async function getUserCountry() {
  try {
    const res = await axios.get('https://ipapi.co/json/');
    const countryCode = res.data.country; // 例: 'JP', 'US'
    console.log('🌍 検出されたユーザーの国コード:', countryCode);
    return countryCode;
  } catch (error) {
    console.error('国コードの取得に失敗しました:', error.message);
    return 'JP'; // 取得できなかったら日本として扱う
  }
}

async function getRoute() {
  // ✅ ユーザーの国コードを取得
  const userCountry = await getUserCountry();

  // ✅ 国コードによって単位を決定
  const imperialCountries = ['US', 'LR', 'MM'];
  const units = imperialCountries.includes(userCountry) ? 'IMPERIAL' : 'METRIC';
  console.log('📏 使用する単位:', units);

// 新宿駅 → 池袋駅（山手線）
const origin = { location: { latLng: { latitude: 35.690921, longitude: 139.700257 } } }; // 新宿駅
const destination = { location: { latLng: { latitude: 35.729503, longitude: 139.710906 } } }; // 池袋駅
 

  const travelMode = 'TRANSIT'; // 徒歩・電車・バスモード
  const languageCode = 'en';

  const departureTime = {
    seconds: Math.floor((Date.now() + 30 * 60 * 1000) / 1000) // 30分後
  };

  const requestBody = {
    origin,
    destination,
    travelMode,
    languageCode,
    units,
    departureTime, // ← ここ追加！
    transitPreferences: {
      allowedTravelModes: ['BUS', 'RAIL', 'TRAIN']
    }
  };

  try {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': '*'
        }
      }
    );

    console.log('✅ ルート取得成功：');
    console.log(JSON.stringify(response.data, null, 2));

      // 🔍 ルートが空かどうかをここでチェック
  if (!response.data.routes || response.data.routes.length === 0) {
    console.warn('⚠️ routes は空です。ルートが見つかりませんでした。');
  }

  } catch (error) {
    console.error('❌ エラー:', error.response?.data || error.message);
  }
}

getRoute();