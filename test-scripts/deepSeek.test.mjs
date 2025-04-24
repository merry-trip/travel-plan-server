// test-scripts/deepSeek.test.mjs

import { completeWithDeepSeek } from '../app/domains/spots/completeWithDeepSeek.mjs';
import { updateSpotDetails } from '../app/domains/spots/updateSpotDetails.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境明示

const context = 'deepSeek.test';

const testSpot = {
  placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E',
  name: 'Sunshine City',
  primary_type: 'Shopping Mall',
  types: ['shopping_mall', 'aquarium']
};

try {
  logInfo(context, `🧪 DeepSeek補完テスト開始（env=${config.env}）`);
  const enriched = await completeWithDeepSeek(testSpot);

  logInfo(context, '✅ 補完結果:');
  console.log('\n--- 補完された内容 ---');
  console.log('📌 description:', enriched.description);
  console.log('📌 short_tip_en:', enriched.short_tip_en);
  console.log('📌 status:', enriched.ai_description_status);

  if (enriched.ai_description_status === 'done') {
    logInfo(context, '📝 上書き処理を実行します...');
    await updateSpotDetails(enriched);
  } else {
    logInfo(context, '⚠️ ステータスが failed のため、上書きはスキップされました。');
  }
} catch (err) {
  logError(context, `❌ DeepSeekテスト失敗: ${err.message}`);
}
