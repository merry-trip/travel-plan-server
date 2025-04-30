// app/utils/appendRow.mjs

import { google } from 'googleapis';
import { getAuthClient } from './auth.mjs';
import { logInfo, logError } from './logger.mjs';
import config from '@/config.mjs';

const context = 'appendRow';
const spreadsheetId = config.SHEET_ID_SPOT;

/**
 * 指定シートに1行追記
 * @param {Array} row - スプレッドシートの1行分のデータ
 * @param {string} sheetName - 書き込み先のシート名（例："spots"）
 */
export default async function appendRow(row, sheetName) {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    logInfo(context, `✅ 1 row appended to sheet: ${sheetName}`);
  } catch (error) {
    logError(context, `❌ Failed to append row: ${error.message}`);
    throw error;
  }
}
