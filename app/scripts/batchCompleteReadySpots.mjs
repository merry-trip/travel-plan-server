// app/scripts/batchCompleteReadySpots.mjs

import { getSheetClient } from '../utils/sheets.mjs';
import { completeFullSpotInfo } from '../domains/spots/completeFullSpotInfo.mjs';
import { logInfo, logWarn, logError } from '../utils/logger.mjs';
import config from '../../config.mjs';

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
    logInfo(CONTEXT, '🔍 Step1: Sheetsクライアント取得開始（REST版）');
    const sheets = await getSheetClient();
    logInfo(CONTEXT, '✅ Step1完了: Sheetsクライアント取得成功');

    logInfo(CONTEXT, '🔍 Step2: シートデータ取得開始（REST API）');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
      majorDimension: 'ROWS', // 明示しておくと安心
    });
    logInfo(CONTEXT, '✅ Step2完了: シートデータ取得成功');

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      logWarn(CONTEXT, '⚠️ シートにデータが存在しません');
      return result;
    }

    const header = rows[0];
    const dataRows = rows.slice(1);

    const keywordIndex = header.indexOf('keyword');
    const statusIndex = header.indexOf('status');

    if (keywordIndex === -1 || statusIndex === -1) {
      logError(CONTEXT, '❌ ヘッダーに keyword または status が存在しません');
      return result;
    }
    logInfo(CONTEXT, '✅ Step3: ヘッダー解析成功');

    const readyKeywords = dataRows
      .filter(row => (row[statusIndex] || '').trim().toLowerCase() === 'ready')
      .map(row => row[keywordIndex])
      .filter(Boolean);

    if (readyKeywords.length === 0) {
      logInfo(CONTEXT, '✅ 処理対象（status=ready）はありません。終了します。');
      return result;
    }

    logInfo(CONTEXT, `📋 処理対象キーワード数: ${readyKeywords.length} 件`);
    logInfo(CONTEXT, `📝 対象キーワード一覧: ${readyKeywords.join(', ')}`);

    for (const keyword of readyKeywords) {
      logInfo(CONTEXT, `▶️ 補完処理開始: "${keyword}"`);

      try {
        await completeFullSpotInfo(keyword);
        logInfo(CONTEXT, `✅ 補完成功: "${keyword}"`);
        result.successCount++;
      } catch (err) {
        logWarn(CONTEXT, `⚠️ 補完失敗: "${keyword}"`);
        logError(CONTEXT, err);
        result.failedKeywords.push(keyword);
      }
    }

    result.failCount = readyKeywords.length - result.successCount;

    logInfo(CONTEXT, '🏁 バッチ処理完了');
    logInfo(CONTEXT, `📊 成功: ${result.successCount} 件 / 失敗: ${result.failCount} 件`);

    if (result.failedKeywords.length > 0) {
      logWarn(CONTEXT, `⚠️ 失敗キーワード一覧: ${result.failedKeywords.join(', ')}`);
    }

    return result;
  } catch (err) {
    logError(CONTEXT, `❌ バッチ全体のエラー発生: ${err.message}`);
    throw err;
  }
}

// CLI実行用（import実行との分離）
if (import.meta.url === `file://${process.argv[1]}`) {
  logInfo('global', '🔵 CLIモードで runBatchComplete() を実行します（REST版）');
  runBatchComplete()
    .catch((err) => {
      logError('global', `❌ runBatchComplete() 実行中にエラー発生: ${err.message}`);
      process.exit(1); // 明示的にエラー終了させる
    });
}
