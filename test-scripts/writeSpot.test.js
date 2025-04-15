// test-scripts/writeSpot.test.js
require('dotenv').config(); // .env を読み込む
const { writeSpot } = require('../app/domains/spots/writeSpot');
const logger = require('../app/utils/logger');

(async () => {
  const context = 'writeSpot.test';

  // ✅ テスト用スポットデータ（最低限の4項目）
  const spot = {
    placeId: 'test123',
    name: 'Test Spot',
    lat: 35.6895,
    lng: 139.6917,
  };

  try {
    logger.logInfo(context, '🧪 writeSpot テスト開始');
    await writeSpot(spot);
    logger.logInfo(context, '✅ writeSpot テスト成功');
  } catch (err) {
    logger.logError(context, `❌ writeSpot テスト失敗: ${err.message}`);
  }
})();
