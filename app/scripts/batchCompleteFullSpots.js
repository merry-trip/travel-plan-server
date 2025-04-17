// app/scripts/batchCompleteFullSpots.js

const { getKeywordsFromSheet } = require('../domains/spots/getKeywordsFromSheet.js');
const { completeFullSpotInfo } = require('../domains/spots/completeFullSpotInfo.js');
const { logInfo, logError } = require('../utils/logger.js');
const config = require('../config'); // ✅ config 導入

const CONTEXT = 'batchCompleteFullSpots';

/**
 * スポット補完バッチ処理
 */
const main = async () => {
  logInfo(CONTEXT, '🔄 スポット補完バッチ開始');

  const keywords = await getKeywordsFromSheet();
  logInfo(CONTEXT, `📋 処理対象キーワード数: ${keywords.length}`);

  for (const row of keywords) {
    const keyword = row.keyword; // ✅ 必ず文字列に
    logInfo(CONTEXT, `🟡 スポット補完開始: ${keyword}`);

    try {
      await completeFullSpotInfo(keyword);
      logInfo(CONTEXT, `✅ 補完成功: ${keyword}`);
    } catch (error) {
      logError(CONTEXT, `❌ 補完失敗: ${keyword}\n${error}`);
    }
  }

  logInfo(CONTEXT, '🏁 スポット補完バッチ完了');
};

// ✅ テスト環境時は実行しないようにする（.env → config 経由）
if (config.env !== 'test') {
  main();
}
