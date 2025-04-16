// app/scripts/batchCompleteReadySpots.js

require('dotenv').config();

const { getSheetClient } = require('../libs/sheets');
const { completeFullSpotInfo } = require('../domains/spots/completeFullSpotInfo');
const { logInfo, logError } = require('../utils/logger');

const SHEET_NAME = 'anime_keywords';
const CONTEXT = 'batchCompleteReadySpots';

(async () => {
  logInfo(CONTEXT, '🚀 バッチ処理を開始（status=ready のキーワードを順次処理）');

  try {
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID_KEYWORDS,
      range: SHEET_NAME
    });

    const rows = response.data.values;
    const header = rows[0] || [];
    const dataRows = rows.slice(1);

    const keywordIndex = header.indexOf('keyword');
    const statusIndex = header.indexOf('status');

    if (keywordIndex === -1 || statusIndex === -1) {
      logError(CONTEXT, '❌ ヘッダーに必要な列（keyword / status）が見つかりません');
      return;
    }

    const readyKeywords = dataRows
      .filter(row => (row[statusIndex] || '').trim().toLowerCase() === 'ready')
      .map(row => row[keywordIndex])
      .filter(Boolean);

    if (readyKeywords.length === 0) {
      logInfo(CONTEXT, '✅ 処理対象（status=ready）はありません。終了します。');
      return;
    }

    logInfo(CONTEXT, `📋 処理対象キーワード数: ${readyKeywords.length} 件`);

    for (const keyword of readyKeywords) {
      logInfo(CONTEXT, `▶️ 実行中: "${keyword}"`);
      try {
        await completeFullSpotInfo(keyword);
      } catch (err) {
        logError(CONTEXT, `❌ 処理失敗: ${keyword}`);
        logError(CONTEXT, err);
      }
    }

    logInfo(CONTEXT, '✅ バッチ処理が完了しました');
  } catch (err) {
    logError(CONTEXT, `❌ バッチ全体のエラー: ${err.message}`);
  }
})();
