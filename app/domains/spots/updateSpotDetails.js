// app/domains/spots/updateSpotDetails.js
const { getSheetClient } = require('../../libs/sheets'); // 認証＆API操作
const columnOrder = require('./columnOrder');
const logger = require('../../utils/logger');

const SHEET_NAME = 'spots';
const context = 'updateSpotDetails';

/**
 * スプレッドシート上の既存スポット（placeId一致）に対して、
 * description / tip / status を上書き保存する
 * @param {Object} updatedSpot - 補完済みのスポットオブジェクト
 * @returns {Promise<void>}
 */
async function updateSpotDetails(updatedSpot) {
  try {
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID_SPOTS,
      range: `${SHEET_NAME}`
    });

    const rows = response.data.values;
    const header = rows[0];
    const dataRows = rows.slice(1);

    const placeIdIndex = header.indexOf('placeId');
    const targetRowIndex = dataRows.findIndex(row => row[placeIdIndex] === updatedSpot.placeId);

    if (targetRowIndex === -1) {
      logger.logError(context, `❌ 該当スポットが見つかりません: ${updatedSpot.placeId}`);
      return;
    }

    const rowIndexInSheet = targetRowIndex + 2; // シートは1始まり＋ヘッダー行
    logger.logInfo(context, `📝 上書き対象行: ${rowIndexInSheet} (${updatedSpot.name || updatedSpot.placeId})`);

    const fieldsToUpdate = ['description', 'short_tip_en', 'ai_description_status', 'status'];
    const valueArray = fieldsToUpdate.map(field => updatedSpot[field] || '');

    const columnIndexes = fieldsToUpdate.map(field => header.indexOf(field));

    const requests = columnIndexes.map((colIndex, i) => ({
      range: `${SHEET_NAME}!${columnToLetter(colIndex + 1)}${rowIndexInSheet}`,
      values: [[valueArray[i]]]
    }));

    for (const req of requests) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SPREADSHEET_ID_SPOTS,
        range: req.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: req.values }
      });
    }

    logger.logInfo(context, `✅ 上書き完了: ${updatedSpot.placeId}`);
  } catch (err) {
    logger.logError(context, `❌ updateSpotDetails 失敗: ${err.message}`);
    throw err;
  }
}

/**
 * 数字 → Excel列記号（例：1 → A, 27 → AA）
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

// ✅ 修正後（推奨）
module.exports = { updateSpotDetails };

