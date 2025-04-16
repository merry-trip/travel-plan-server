// test-scripts/writeSpots.test.js
require('dotenv').config(); // .env 読み込み
const { writeSpots } = require('../app/domains/spots/writeSpots');
const logger = require('../app/utils/logger');

(async () => {
  const context = 'writeSpots.test';

  // ✅ 複数スポットデータ（最低限の4項目）
  const spots = [
    {
      placeId: 'test001',
      name: 'Test Spot A',
      lat: 35.6895,
      lng: 139.6917,
    },
    {
      placeId: 'test002',
      name: 'Test Spot B',
      lat: 34.6937,
      lng: 135.5023,
    },
    {
      placeId: 'test003',
      name: 'Test Spot C',
      lat: 43.0642,
      lng: 141.3469,
    },
  ];

  try {
    logger.logInfo(context, '🧪 writeSpots テスト開始');
    await writeSpots(spots);
    logger.logInfo(context, '✅ writeSpots テスト成功');
  } catch (err) {
    logger.logError(context, `❌ writeSpots テスト失敗: ${err.message}`);
  }
})();
