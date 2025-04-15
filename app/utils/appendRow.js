// app/utils/appendRow.js
const { google } = require('googleapis');
const auth = require('./auth');
const logger = require('./logger');

const context = 'appendRow';
const spreadsheetId = process.env.SPREADSHEET_ID_SPOTS;

/**
 * 指定シートに1行追記
 * @param {Array} row - スプレッドシートの1行分のデータ
 * @param {string} sheetName - 書き込み先のシート名（例："spots"）
 */
async function appendRow(row, sheetName) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
    logger.logInfo(context, `1 row appended to sheet: ${sheetName}`);
  } catch (error) {
    logger.logError(context, `Failed to append row: ${error.message}`);
    throw error; // 上位でキャッチさせる
  }
}

module.exports = appendRow;
