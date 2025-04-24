// app/utils/getStoredPlaceIds.mjs

import { getSheetClient } from '../libs/sheets.mjs';
import config from '../config.mjs';
import { logInfo, logWarn, logError } from './logger.mjs';

const CONTEXT = 'getStoredPlaceIds';

/**
 * スプレッドシートから既存の placeId 一覧を取得する
 * @returns {Promise<string[]>}
 */
export async function getStoredPlaceIds() {
  try {
    const sheets = await getSheetClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.SHEET_ID_SPOT,
      range: config.SHEET_NAME_SPOT,
    });

    const rows = res.data.values || [];
    const header = rows[0] || [];
    const placeIdIndex = header.indexOf('placeId');

    if (placeIdIndex === -1) {
      logWarn(CONTEXT, '⚠️ placeId列が見つかりませんでした');
      return [];
    }

    const ids = rows
      .slice(1)
      .map(row => row[placeIdIndex])
      .filter(Boolean);

    logInfo(CONTEXT, `📦 既存placeId数: ${ids.length} 件`);
    return ids;
  } catch (err) {
    logError(CONTEXT, `❌ スプレッドシートからplaceId取得失敗: ${err.message}`);
    return [];
  }
}
