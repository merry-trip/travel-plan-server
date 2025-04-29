// app/domains/spots/updateSpotDetails.mjs

import { getSheetClient } from '../../utils/sheets.mjs'; // 認証＆API操作
import columnOrder from './columnOrder.mjs';
import config from '../../config.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';

const SHEET_NAME = config.SHEET_NAME_SPOT;
const SPREADSHEET_ID = config.SHEET_ID_SPOT;

const context = 'updateSpotDetails';

/**
 * スプレッドシート上の既存スポット（placeId一致）に対して、
 * description / tip / ai_description_status などを上書き保存する。
 * status や last_updated_at も必要に応じて更新。
 * @param {Object} updatedSpot - 補完済みのスポットオブジェクト
 * @returns {Promise<void>}
 */
export async function updateSpotDetails(updatedSpot) {
  try {
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });

    const rows = response.data.values;
    const header = rows[0];
    const dataRows = rows.slice(1);

    const placeIdIndex = header.indexOf('placeId');
    const targetRowIndex = dataRows.findIndex(row => row[placeIdIndex] === updatedSpot.placeId);

    if (targetRowIndex === -1) {
      logError(context, `❌ 該当スポットが見つかりません: ${updatedSpot.placeId}`);
      return;
    }

    const rowIndexInSheet = targetRowIndex + 2; // 1始まり + ヘッダー行
    logInfo(context, `📝 上書き対象行: ${rowIndexInSheet} (${updatedSpot.name || updatedSpot.placeId})`);

    const candidateFields = [
      'description',
      'short_tip_en',
      'ai_description_status',
      'status',
      'last_updated_at'
    ];

    const fieldsToUpdate = candidateFields.filter(field => updatedSpot[field] !== undefined);

    if (fieldsToUpdate.length === 0) {
      logInfo(context, `ℹ️ 更新対象フィールドなし: ${updatedSpot.placeId}`);
      return;
    }

    const valueArray = fieldsToUpdate.map(field => updatedSpot[field] || '');
    const columnIndexes = fieldsToUpdate.map(field => header.indexOf(field));

    const requests = columnIndexes.map((colIndex, i) => ({
      range: `${SHEET_NAME}!${columnToLetter(colIndex + 1)}${rowIndexInSheet}`,
      values: [[valueArray[i]]],
    }));

    for (const req of requests) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: req.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: req.values },
      });
    }

    logInfo(context, `✅ 上書き完了: ${updatedSpot.placeId} → [${fieldsToUpdate.join(', ')}]`);
  } catch (err) {
    logError(context, `❌ updateSpotDetails 失敗: ${err.message}`);
    throw err;
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
