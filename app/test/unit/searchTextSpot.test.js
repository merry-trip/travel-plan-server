// test-scripts/searchTextSpot.test.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const { searchTextSpot } = require('../app/domains/spots/searchTextSpot');
const logger = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 現在の環境を確認用に読み込み

(async () => {
  const context = 'searchTextSpot.test';

  const query = 'アニメイト新宿'; // ✅ 任意の検索キーワードに変更OK

  try {
    logger.logInfo(context, `🧪 SearchTextSpot テスト開始（env=${config.env}）: ${query}`);
    const result = await searchTextSpot(query);

    if (result) {
      logger.logInfo(context, `✅ 検索成功: ${result.name} (${result.placeId})`);
      console.log('\n--- 検索結果 ---');
      console.dir(result, { depth: 3 });
    } else {
      logger.logInfo(context, '⚠️ 該当なし（nullが返却されました）');
    }
  } catch (err) {
    logger.logError(context, `❌ テスト失敗: ${err.message}`);
  }
})();
