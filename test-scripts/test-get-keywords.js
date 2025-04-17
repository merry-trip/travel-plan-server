// test-scripts/test-get-keywords.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const getKeywordsFromSheet = require('../app/domains/spots/getKeywordsFromSheet');
const logger = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 環境確認用

const context = 'test-get-keywords';

(async () => {
  try {
    logger.logInfo(context, `🧪 キーワード読み取り開始（env=${config.env}）`);

    const keywords = await getKeywordsFromSheet();

    logger.logInfo(context, `✅ 読み取り成功：${keywords.length} 件`);
    keywords.forEach((k, i) =>
      logger.logInfo(context, `#${i + 1}: row=${k.rowIndex} / keyword="${k.keyword}"`)
    );
  } catch (err) {
    logger.logError(context, `❌ エラー: ${err.message}`);
  }
})();
