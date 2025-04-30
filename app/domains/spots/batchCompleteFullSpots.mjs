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

  let success = 0;
  let skipped = 0; // 今は使わないけど、将来拡張用に置いておいてOK
  let failed = 0;

  for (const row of keywords) {
    const keyword = row.keyword;
    logInfo(CONTEXT, `🟡 スポット補完開始: ${keyword}`);

    try {
      await completeFullSpotInfo(keyword);
      logInfo(CONTEXT, `✅ 補完成功: ${keyword}`);
      success++; // 成功カウント
    } catch (error) {
      logError(CONTEXT, `❌ 補完失敗: ${keyword}\n${error}`);
      failed++; // ここを追加！（失敗カウント）
    }
  }

  logInfo(CONTEXT, `📊 バッチ結果: 成功=${success}件 / 失敗=${failed}件 / 全体=${keywords.length}件`);
  logInfo(CONTEXT, '🏁 スポット補完バッチ完了');
}
