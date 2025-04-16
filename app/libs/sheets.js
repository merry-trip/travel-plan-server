// app/libs/sheets.js
require('dotenv').config();
const { google } = require('googleapis');
const logger = require('../utils/logger');

const context = 'sheets';

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return await auth.getClient();
}

/**
 * 指定したシートから全行データを取得
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @returns {Promise<Array<Object>>}
 */
async function getRowsFromSheet(spreadsheetId, sheetName) {
  try {
    const authClient = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      logger.logInfo(context, '⚠️ No data found in sheet');
      return [];
    }

    // 最初の行はヘッダー → オブジェクトに変換
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const entry = {};
      headers.forEach((key, i) => {
        entry[key] = row[i] || ''; // 欠損セルには空文字
      });
      return entry;
    });

    logger.logInfo(context, `✅ ${data.length} rows loaded from "${sheetName}"`);
    return data;

  } catch (err) {
    logger.logError(context, `❌ Failed to read sheet "${sheetName}": ${err.message}`);
    throw err;
  }
}

module.exports = {
  getRowsFromSheet,
};
