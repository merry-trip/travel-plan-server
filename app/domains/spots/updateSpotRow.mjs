// app/domains/spots/updateSpotRow.mjs

import updateSheetRow from '../../utils/updateSheetRow.mjs';
import config from '../../config.mjs';
import columnOrder from './columnOrder.mjs';

/**
 * SpotDB に特化した上書き処理
 * - placeId をキーに1行検索
 * - 指定されたフィールドのみを上書き
 */
export default async function updateSpotRow(placeId, updates) {
  const sheetId = config.SHEET_ID_SPOT;
  const sheetName = config.SHEET_NAME_SPOT;

  return await updateSheetRow(sheetId, sheetName, placeId, updates, columnOrder);
}
