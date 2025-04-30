// app/domains/keywords/updateKeywordStatus.mjs

import { getSheetClient } from '../../utils/sheets.mjs';
import { logInfo, logError, logWarn } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const SHEET_NAME = config.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = config.SHEET_ID_KEYWORDS;
const context = 'updateKeywordStatus';

// 有効なステータス一覧
const VALID_STATUSES = ['ready', 'done', 'error', 'failed', 'skip', 'skipped'];

/**
 * 指定された keyword に一致する行の status を更新する
 * @param {string} keyword - 対象の英語キーワード（例: 'Akihabara Animate'）
 * @param {'ready'|'done'|'error'|'failed'|'skip'|'skipped'} status - 書き込む status 値
 * @returns {Promise<void>}
 */
export async function updateKeywordStatus(keyword, status) {
  try {
    if (!keyword || !status) {
      logError(context, '❌ keyword または status が未指定です');
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      logError(context, `❌ 無効な status 値です: ${status}（有効: ${VALID_STATUSES.join(', ')})`);
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
      logError(context, `❌ ヘッダーに 'keyword' または 'status' が存在しません\n現在のヘッダー: ${JSON.stringify(header)}`);
      return;
    }

    const targetRowIndex = dataRows.findIndex(row => (row[keywordIndex] || '').trim() === keyword.trim());
    if (targetRowIndex === -1) {
      logWarn(context, `⚠️ 該当する keyword が見つかりません: "${keyword}"`);
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

    logInfo(context, `✅ keyword="${keyword}" → status="${status}" に更新完了`);
  } catch (err) {
    logError(context, `❌ ステータス更新失敗: ${err.message}`);
  }
}

/**
 * 列番号（1始まり）を列記号（A, B, ..., AAなど）に変換
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
