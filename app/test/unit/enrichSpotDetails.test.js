// test-scripts/enrichSpotDetails.test.js

process.env.APP_ENV = 'test'; // ✅ 明示的にテスト環境を指定

const enrichSpotDetails = require('../app/domains/spots/enrichSpotDetails');
const logger = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 現在の環境確認に使用

(async () => {
  const context = 'enrichSpotDetails.test';

  const spot = {
    placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E', // 任意のplaceId（Sunshine Cityなど）
    name: '',
    lat: 0,
    lng: 0
  };

  try {
    logger.logInfo(context, `🧪 enrichSpotDetails テスト開始（env=${config.env}）`);
    const enriched = await enrichSpotDetails(spot);
    logger.logInfo(context, '✅ enrichSpotDetails テスト成功');

    console.log('\n--- 結果 ---');
    console.dir(enriched, { depth: 3 });
  } catch (err) {
    logger.logError(context, `❌ enrichSpotDetails テスト失敗: ${err.message}`);
  }
})();
