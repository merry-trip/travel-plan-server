// app/domains/spots/updateSpotRow.js

const updateSheetRow = require('../../utils/updateSheetRow');
const { getConfig } = require('../../config');
const columnOrder = require('./columnOrder');

/**
 * SpotDB に特化した上書き処理
 * - placeId をキーに1行検索
 * - 指定されたフィールドのみを上書き
 */
async function updateSpotRow(placeId, updates) {
  const config = getConfig();
  const sheetId = config.SHEET_ID_SPOT;
  const sheetName = config.SHEET_NAME_SPOT;

  return await updateSheetRow(sheetId, sheetName, placeId, updates, columnOrder);
}

module.exports = updateSpotRow;
