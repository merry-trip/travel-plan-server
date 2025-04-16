// test-scripts/searchTextSpot.test.js
require('dotenv').config(); // .env を読み込む
const { searchTextSpot } = require('../app/domains/spots/searchTextSpot');
const logger = require('../app/utils/logger');

(async () => {
  const context = 'searchTextSpot.test';

  const query = 'アニメイト新宿'; // ✅ 任意の検索キーワードに変更OK

  try {
    logger.logInfo(context, `🧪 SearchTextSpot テスト開始: ${query}`);
    const result = await searchTextSpot(query);

    if (result) {
      logger.logInfo(context, `✅ 検索成功: ${result.name} (${result.placeId})`);
      console.log('\n--- 検索結果 ---');
      console.log(result);
    } else {
      logger.logInfo(context, '⚠️ 該当なし（nullが返却されました）');
    }
  } catch (err) {
    logger.logError(context, `❌ テスト失敗: ${err.message}`);
  }
})();
