// test-scripts/deepSeek.test.js
require('dotenv').config();
const completeWithDeepSeek = require('../app/domains/spots/completeWithDeepSeek');
const updateSpotDetails = require('../app/domains/spots/updateSpotDetails');
const logger = require('../app/utils/logger');

(async () => {
  const context = 'deepSeek.test';

  const testSpot = {
    placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E',
    name: 'Sunshine City',
    primary_type: 'Shopping Mall',
    types: ['shopping_mall', 'aquarium']
  };

  try {
    logger.logInfo(context, '🧪 DeepSeek補完テスト開始');
    const enriched = await completeWithDeepSeek(testSpot);

    logger.logInfo(context, '✅ 補完結果:');
    console.log('\n--- 補完された内容 ---');
    console.log('📌 description:', enriched.description);
    console.log('📌 short_tip_en:', enriched.short_tip_en);
    console.log('📌 status:', enriched.ai_description_status);

    if (enriched.ai_description_status === 'done') {
      logger.logInfo(context, '📝 上書き処理を実行します...');
      await updateSpotDetails(enriched);
    } else {
      logger.logInfo(context, '⚠️ ステータスが failed のため、上書きはスキップされました。');
    }
  } catch (err) {
    logger.logError(context, `❌ DeepSeekテスト失敗: ${err.message}`);
  }
})();
