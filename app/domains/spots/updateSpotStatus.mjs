// app/domains/spots/updateSpotStatus.mjs

import { getSheetClient } from '../../utils/sheets.mjs';
import config from '../../../config.mjs';
import { logInfo, logError, logWarn } from '../../utils/logger.mjs';

const SHEET_NAME = config.SHEET_NAME_SPOT;
const SPREADSHEET_ID = config.SHEET_ID_SPOT;

const context = 'updateSpotStatus';

/**
 * 指定された placeId に一致する行の status（および last_updated_at）を更新する
 * @param {string} placeId - 対象の placeId（必須）
 * @param {'done'|'error'|'ready'} status - 書き込む status 値
 * @returns {Promise<void>}
 */
export async function updateSpotStatus(placeId, status) {
  try {
    if (!placeId || !status) {
      logError(context, '❌ placeId または status が未指定です');
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

    const placeIdIndex = header.indexOf('placeId');
    const statusIndex = header.indexOf('status');
    const dateIndex = header.indexOf('last_updated_at');

    if (placeIdIndex === -1 || statusIndex === -1 || dateIndex === -1) {
      logError(context, `❌ ヘッダーに必要な列が存在しません\n現在のヘッダー: ${JSON.stringify(header)}`);
      return;
    }

    const targetRowIndex = dataRows.findIndex(row => row[placeIdIndex] === placeId);
    if (targetRowIndex === -1) {
      logWarn(context, `⚠️ 該当する placeId が見つかりません: ${placeId}`);
      return;
    }

    const rowIndexInSheet = targetRowIndex + 2; // 1始まり + ヘッダー行
    const statusRange = `${SHEET_NAME}!${columnToLetter(statusIndex + 1)}${rowIndexInSheet}`;
    const dateRange = `${SHEET_NAME}!${columnToLetter(dateIndex + 1)}${rowIndexInSheet}`;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: statusRange, values: [[status]] },
          { range: dateRange, values: [[today]] }
        ]
      }
    });

    logInfo(context, `✅ status=${status} / last_updated_at=${today} に更新: ${placeId}`);
  } catch (err) {
    logError(context, `❌ ステータス更新失敗: ${err.message}`);
  }
}

/**
 * 数字 → Excel列記号（例：1 → A, 27 → AA）
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
