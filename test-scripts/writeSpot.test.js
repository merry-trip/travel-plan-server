// test-scripts/writeSpot.test.js

process.env.APP_ENV = 'test'; // ✅ テスト環境明示

const { writeSpot } = require('../app/domains/spots/writeSpot');
const logger = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 実行環境確認用

(async () => {
  const context = 'writeSpot.test';

  const spot = {
    placeId: 'test123',
    name: 'Test Spot',
    lat: 35.6895,
    lng: 139.6917,
  };

  try {
    logger.logInfo(context, `🧪 writeSpot テスト開始（env=${config.env}）`);
    await writeSpot(spot);
    logger.logInfo(context, '✅ writeSpot テスト成功');
  } catch (err) {
    logger.logError(context, `❌ writeSpot テスト失敗: ${err.message}`);
  }
})();
