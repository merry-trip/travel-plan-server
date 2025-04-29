// app/utils/updateSheetRow.mjs

import { getSheetClient } from './auth.mjs';
import { logInfo, logWarn } from './logger.mjs'; // ✅ 正しいimport

/**
 * 任意の placeId に一致する行を見つけ、指定されたフィールドのみを上書き
 * @param {string} sheetId - スプレッドシートID
 * @param {string} sheetName - シート名
 * @param {string} placeId - 更新対象のplaceId
 * @param {Object} updates - 上書きする { フィールド名: 値 } のオブジェクト
 * @param {string[]} columnOrder - 列順（header定義）
 */
export default async function updateSheetRow(sheetId, sheetName, placeId, updates = {}, columnOrder) {
  const client = await getSheetClient();
  const sheet = client.sheetsByTitle[sheetName];

  await sheet.loadCells(); // セル全体を読み込み
  const rows = await sheet.getRows();

  const targetIndex = rows.findIndex(row => row.place_id === placeId);
  if (targetIndex === -1) {
    logWarn('updateSheetRow', `⚠️ 行が見つかりませんでした: ${placeId}`);
    return null;
  }

  const targetRow = rows[targetIndex];
  let updated = false;

  for (const [key, value] of Object.entries(updates)) {
    if (key in targetRow && targetRow[key] !== value) {
      targetRow[key] = value;
      updated = true;
    }
  }

  if (updated) {
    await targetRow.save();
    logInfo('updateSheetRow', `✅ 更新成功: ${placeId} → ${JSON.stringify(updates)}`);
  } else {
    logInfo('updateSheetRow', `🔁 更新不要（変更なし）: ${placeId}`);
  }

  return targetRow;
}
