// app/utils/appendRows.js

const { google } = require('googleapis');
const auth = require('./auth');
const logger = require('./logger');
const config = require('../config'); // ✅ config導入

const spreadsheetId = config.SPREADSHEET_ID_SPOTS;

/**
 * 複数行のデータを指定シートに追記
 * @param {Array<Array>} rows - 追記する行の配列（例: [[...], [...]]）
 * @param {string} sheetName - 対象シート名（例: "spots"）
 */
async function appendRows(rows, sheetName) {
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows,
    },
  });

  logger.logInfo('appendRows', `✅ ${rows.length} row(s) appended to sheet: ${sheetName}`);
}

module.exports = appendRows;
