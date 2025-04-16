// test-scripts/enrichSpotDetails.test.js
require('dotenv').config();
const enrichSpotDetails = require('../app/domains/spots/enrichSpotDetails'); // ← 修正済
const logger = require('../app/utils/logger');

(async () => {
  const context = 'enrichSpotDetails.test';

  const spot = {
    placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E', // 任意のplaceId
    name: '',
    lat: 0,
    lng: 0
  };

  try {
    logger.logInfo(context, '🧪 enrichSpotDetails テスト開始');
    const enriched = await enrichSpotDetails(spot);
    logger.logInfo(context, '✅ enrichSpotDetails テスト成功');
    console.log('\n--- 結果 ---');
    console.log(enriched);
  } catch (err) {
    logger.logError(context, `❌ enrichSpotDetails テスト失敗: ${err.message}`);
  }
})();
