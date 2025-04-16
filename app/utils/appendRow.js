// app/utils/appendRow.js

const { google } = require('googleapis');
const { getAuthClient } = require('./auth'); // ✅ 認証クライアント取得関数
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
    // ✅ 必要な認証クライアントを取得
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

    logger.logInfo(context, `✅ 1 row appended to sheet: ${sheetName}`);
  } catch (error) {
    logger.logError(context, `❌ Failed to append row: ${error.message}`);
    throw error;
  }
}

module.exports = appendRow;
