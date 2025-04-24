// app/scripts/batchCompleteReadySpots.mjs

import { getSheetClient } from '../libs/sheets.mjs';
import { completeFullSpotInfo } from '../domains/spots/completeFullSpotInfo.mjs';
import { logInfo, logWarn, logError } from '../utils/logger.mjs';
import config from '../config.mjs';

const SPREADSHEET_ID = config.SHEET_ID_KEYWORDS;
const SHEET_NAME = config.SHEET_NAME_KEYWORDS;
const CONTEXT = 'batchCompleteReadySpots';

/**
 * status=ready のキーワードを取得して順次補完するバッチ処理
 * @returns {Promise<{ successCount: number, failCount: number, failedKeywords: string[] }>}
 */
export async function runBatchComplete() {
  logInfo(CONTEXT, '🚀 バッチ処理を開始（status=ready のキーワードを順次処理）');

  const result = {
    successCount: 0,
    failCount: 0,
    failedKeywords: [],
  };

  try {
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });

    const rows = response.data.values;
    const header = rows[0] || [];
    const dataRows = rows.slice(1);

    const keywordIndex = header.indexOf('keyword');
    const statusIndex = header.indexOf('status');

    if (keywordIndex === -1 || statusIndex === -1) {
      logError(CONTEXT, '❌ ヘッダーに keyword または status が存在しません');
      return result;
    }

    const readyKeywords = dataRows
      .filter(row => (row[statusIndex] || '').trim().toLowerCase() === 'ready')
      .map(row => row[keywordIndex])
      .filter(Boolean);

    if (readyKeywords.length === 0) {
      logInfo(CONTEXT, '✅ 処理対象（status=ready）はありません。終了します。');
      return result;
    }

    logInfo(CONTEXT, `📋 処理対象キーワード数: ${readyKeywords.length} 件`);

    for (const keyword of readyKeywords) {
      logInfo(CONTEXT, `▶️ 実行中: "${keyword}"`);

      try {
        await completeFullSpotInfo(keyword); // 内部で status 更新済み
        result.successCount++;
      } catch (err) {
        logWarn(CONTEXT, `⚠️ completeFullSpotInfo内で未処理の例外: ${keyword}`);
        logError(CONTEXT, err);
        result.failedKeywords.push(keyword);
      }
    }

    result.failCount = readyKeywords.length - result.successCount;

    logInfo(CONTEXT, '✅ バッチ処理が完了しました');
    logInfo(CONTEXT, `📊 成功: ${result.successCount} 件 / 失敗: ${result.failCount} 件`);

    if (result.failedKeywords.length > 0) {
      logWarn(CONTEXT, `⚠️ 失敗キーワード一覧: ${result.failedKeywords.join(', ')}`);
    }

    return result;
  } catch (err) {
    logError(CONTEXT, `❌ バッチ全体のエラー: ${err.message}`);
    return result;
  }
}

// CLI 実行と import 実行の分離（ESM方式）
if (import.meta.url === `file://${process.argv[1]}`) {
  runBatchComplete();
}
