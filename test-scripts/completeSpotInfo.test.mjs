// test-scripts/completeSpotInfo.test.mjs

import config from '../app/config.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import completeSpotInfo from '../app/domains/spots/completeSpotInfo.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const context = 'test-scripts/completeSpotInfo';
const inputText = 'Akihabara Animate';

logInfo(context, `🔍 テスト開始（env=${config.env}）: "${inputText}"`);

try {
  const result = await completeSpotInfo(inputText);
  logInfo(context, `✅ スポット補完結果:`);

  // コンソール表示用にdepthを深めに設定（ネストした構造を確認）
  console.dir(result, { depth: 5 });
} catch (err) {
  logError(context, `❌ エラー: ${err.message}`);
}
