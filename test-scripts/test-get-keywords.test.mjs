// test-scripts/test-get-keywords.test.mjs

import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';
import { getKeywordsFromSheet } from '../app/domains/spots/getKeywordsFromSheet.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const context = 'test-get-keywords';

try {
  logInfo(context, `🧪 キーワード読み取り開始（env=${config.env}）`);

  const keywords = await getKeywordsFromSheet();

  logInfo(context, `✅ 読み取り成功：${keywords.length} 件`);
  keywords.forEach((k, i) => {
    logInfo(context, `#${i + 1}: row=${k.rowIndex} / keyword="${k.keyword}"`);
  });
} catch (err) {
  logError(context, `❌ エラー: ${err.message}`);
}
