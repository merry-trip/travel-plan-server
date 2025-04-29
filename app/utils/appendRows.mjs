// app/utils/appendRows.mjs

import { google } from 'googleapis';
import { getAuthClient } from './auth.mjs';
import { logInfo } from './logger.mjs';
import config from '../config.mjs';

const spreadsheetId = config.SHEET_ID_SPOT;

/**
 * 複数行のデータを指定シートに追記
 * @param {Array<Array>} rows - 追記する行の配列（例: [[...], [...]]）
 * @param {string} sheetName - 対象シート名（例: "spots"）
 */
export default async function appendRows(rows, sheetName) {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows,
    },
  });

  logInfo('appendRows', `✅ ${rows.length} row(s) appended to sheet: ${sheetName}`);
}
