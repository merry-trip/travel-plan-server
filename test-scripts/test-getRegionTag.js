// test-scripts/test-getRegionTag.js

process.env.APP_ENV = 'test'; // ✅ 安全なテスト環境を明示

const axios = require('axios');
const { logInfo, logError, logDebug } = require('../app/utils/logger');
const config = require('../app/config');

const context = 'test-getRegionTag';

async function getRegionTag(lat, lng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.GOOGLE_API_KEY}&language=ja`;
    logDebug(context, `呼び出しURL: ${url}`);

    const res = await axios.get(url);
    const result = res.data.results[0];

    if (!result || !result.address_components) {
      logError(context, '❌ 住所情報が取得できませんでした');
      return;
    }

    const components = result.address_components;

    const sublocality = components.find(comp =>
      comp.types.includes('sublocality_level_1')
    )?.long_name;

    if (sublocality) {
      logInfo(context, `✅ 地区名取得成功 → region_tag = ${sublocality}`);
    } else {
      logInfo(context, '⚠️ sublocality_level_1 が見つかりませんでした（fallback 検討要）');
    }

  } catch (err) {
    logError(context, `❌ API呼び出し失敗: ${err.message}`);
  }
}

// ✅ 秋葉原の緯度経度でテスト
logInfo(context, `🧪 Geocoding API テスト開始（env=${config.env}）`);
getRegionTag(35.698683, 139.773216);
