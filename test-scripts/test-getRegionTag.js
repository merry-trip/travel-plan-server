// test-scripts/test-getRegionTag.js
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const { logInfo, logError, logDebug } = require('../app/utils/logger');

// .env 読み込み（../.env を対象に）
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🔄 環境に応じて APIキーを選択
const APP_ENV = process.env.APP_ENV || 'dev';
const GOOGLE_API_KEY =
  APP_ENV === 'prod'
    ? process.env.GOOGLE_API_KEY_PROD
    : process.env.GOOGLE_API_KEY_DEV;

if (!GOOGLE_API_KEY) {
  logError('test-getRegionTag', '❌ GOOGLE_API_KEY が取得できません。APP_ENV や .env の定義を確認してください');
  process.exit(1);
}

async function getRegionTag(lat, lng) {
  const context = 'test-getRegionTag';

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=ja`;
    logDebug(context, `呼び出しURL: ${url}`);

    const res = await axios.get(url);
    const result = res.data.results[0];

    if (!result || !result.address_components) {
      logError(context, '住所情報が取得できませんでした');
      return;
    }

    const components = result.address_components;

    const sublocality = components.find(comp =>
      comp.types.includes('sublocality_level_1')
    )?.long_name;

    if (sublocality) {
      logInfo(context, `✅ 地区名（sublocality_level_1）取得成功 → region_tag = ${sublocality}`);
    } else {
      logInfo(context, '⚠️ sublocality_level_1 が見つかりませんでした（fallback 検討要）');
    }

  } catch (err) {
    logError(context, err);
  }
}

// ✅ 秋葉原の緯度経度でテスト
getRegionTag(35.698683, 139.773216);
