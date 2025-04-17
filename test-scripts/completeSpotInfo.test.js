// test-scripts/completeSpotInfo.test.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const config = require('../app/config');
const logger = require('../app/utils/logger');
const completeSpotInfo = require('../app/domains/spots/completeSpotInfo');

(async () => {
  const context = 'test-scripts/completeSpotInfo';
  const inputText = 'Akihabara Animate';

  logger.logInfo(context, `🔍 テスト開始（env=${config.env}）: "${inputText}"`);

  try {
    const result = await completeSpotInfo(inputText);
    logger.logInfo(context, `✅ スポット補完結果:`);
    console.dir(result, { depth: 3 });
  } catch (err) {
    logger.logError(context, `❌ エラー: ${err.message}`);
  }
})();
