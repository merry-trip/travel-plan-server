// app/scripts/batchCompleteFullSpots.js

const { getKeywordsFromSheet } = require('../domains/spots/getKeywordsFromSheet.js');
const { completeFullSpotInfo } = require('../domains/spots/completeFullSpotInfo.js');
const { logInfo, logError } = require('../utils/logger.js');

const CONTEXT = 'batchCompleteFullSpots';

const main = async () => {
  logInfo(CONTEXT, '🔄 スポット補完バッチ開始');

  const keywords = await getKeywordsFromSheet();
  logInfo(CONTEXT, `📋 処理対象キーワード数: ${keywords.length}`);

  for (const row of keywords) {
    const keyword = row.keyword; // ✅ ← 必ず文字列にする
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

if (process.env.APP_ENV !== 'test') {
  main();
}
