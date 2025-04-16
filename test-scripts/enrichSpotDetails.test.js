// test-scripts/enrichSpotDetails.test.js
require('dotenv').config();
const { enrichSpotDetails } = require('../app/domains/spots/enrichSpotDetails');
const logger = require('../app/utils/logger');

(async () => {
  const context = 'enrichSpotDetails.test';

  // ✅ テスト用の最小データ（placeIdのみでOK）
  const spot = {
    placeId: 'ChIJkQEWLm2OGGAR9SSyRMpV5cw', // ✅例：Google SydneyのplaceId（またはToshiさんの手元の本物でOK）
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
