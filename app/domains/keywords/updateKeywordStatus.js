// app/domains/keywords/updateKeywordStatus.js

const { getSheetClient } = require('../../libs/sheets');
const logger = require('../../utils/logger');
const config = require('../../config'); // ✅ config導入

const SHEET_NAME = config.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = config.SPREADSHEET_ID_KEYWORDS;

const context = 'updateKeywordStatus';

/**
 * 指定された keyword に一致する行の status を更新する
 * @param {string} keyword - 対象の英語キーワード（例: 'Akihabara Animate'）
 * @param {'done'|'ready'|'error'} status - 書き込む status 値
 * @returns {Promise<void>}
 */
async function updateKeywordStatus(keyword, status) {
  try {
    if (!keyword || !status) {
      logger.logError(context, '❌ keyword または status が未指定です');
      return;
    }

    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });

    const rawHeader = response.data.values[0] || [];
    const header = rawHeader.map(h => h.trim());
    const dataRows = response.data.values.slice(1);

    const keywordIndex = header.indexOf('keyword');
    const statusIndex = header.indexOf('status');

    if (keywordIndex === -1 || statusIndex === -1) {
      logger.logError(context, `❌ ヘッダーに必要な列が存在しません\n現在のヘッダー: ${JSON.stringify(header)}`);
      return;
    }

    const targetRowIndex = dataRows.findIndex(row => row[keywordIndex] === keyword);
    if (targetRowIndex === -1) {
      logger.logWarn(context, `⚠️ 該当する keyword が見つかりません: ${keyword}`);
      return;
    }

    const rowIndexInSheet = targetRowIndex + 2;
    const statusRange = `${SHEET_NAME}!${columnToLetter(statusIndex + 1)}${rowIndexInSheet}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: statusRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      }
    });

    logger.logInfo(context, `✅ keyword="${keyword}" → status=${status} に更新完了`);
  } catch (err) {
    logger.logError(context, `❌ ステータス更新失敗: ${err.message}`);
  }
}

/**
 * 列番号（1始まり）を列記号（A, B, ..., AA）に変換
 * @param {number} col
 * @returns {string}
 */
function columnToLetter(col) {
  let letter = '';
  while (col > 0) {
    const mod = (col - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    col = Math.floor((col - mod) / 26);
  }
  return letter;
}

module.exports = { updateKeywordStatus };
