// app/domains/spots/batchCompleteFullSpots.mjs

import { getKeywordsFromSheet } from './getKeywordsFromSheet.mjs';
import { completeFullSpotInfo } from './completeFullSpotInfo.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';

const CONTEXT = 'batchCompleteFullSpots';

/**
 * スポット補完バッチ処理（呼び出し用）
 */
export async function batchCompleteFullSpots() {
  logInfo(CONTEXT, '🔄 スポット補完バッチ開始');

  const keywords = await getKeywordsFromSheet();
  logInfo(CONTEXT, `📋 処理対象キーワード数: ${keywords.length}`);

  for (const row of keywords) {
    const keyword = row.keyword;
    logInfo(CONTEXT, `🟡 スポット補完開始: ${keyword}`);

    try {
      await completeFullSpotInfo(keyword);
      logInfo(CONTEXT, `✅ 補完成功: ${keyword}`);
    } catch (error) {
      logError(CONTEXT, `❌ 補完失敗: ${keyword}\n${error}`);
    }
  }

  logInfo(CONTEXT, '🏁 スポット補完バッチ完了');
}
