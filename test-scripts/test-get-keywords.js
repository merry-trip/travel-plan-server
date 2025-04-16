// test-scripts/test-get-keywords.js
require('dotenv').config();
const getKeywordsFromSheet = require('../app/domains/spots/getKeywordsFromSheet');
const logger = require('../app/utils/logger');

const context = 'test-get-keywords';

(async () => {
  try {
    const keywords = await getKeywordsFromSheet();
    logger.logInfo(context, `✅ キーワード数: ${keywords.length}`);
    keywords.forEach((k, i) =>
      logger.logInfo(context, `#${i + 1}: ${k}`)
    );
  } catch (err) {
    logger.logError(context, `❌ エラー: ${err.message}`);
  }
})();
