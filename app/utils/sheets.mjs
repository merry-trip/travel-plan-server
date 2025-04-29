// app/utils/sheets.mjs

import fs from 'fs';
import { google } from 'googleapis';
import config from '../config.mjs';
import { logInfo, logError } from '../utils/logger.mjs';

const context = 'sheets';

// 🔍 認証ファイルの存在確認（ログ出力付き）
if (!config.GOOGLE_CREDENTIALS_PATH) {
  logError(context, '❌ 認証ファイルパス (GOOGLE_CREDENTIALS_PATH) が config に定義されていません');
} else if (!fs.existsSync(config.GOOGLE_CREDENTIALS_PATH)) {
  logError(context, `❌ 認証ファイルが見つかりません: ${config.GOOGLE_CREDENTIALS_PATH}`);
} else {
  logInfo(context, `✅ 認証ファイルを確認済: ${config.GOOGLE_CREDENTIALS_PATH}`);
}

/**
 * Google API 認証クライアントを取得
 */
async function getAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: config.GOOGLE_CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return await auth.getClient();
  } catch (err) {
    logError(context, `❌ 認証情報の読み込みに失敗しました: ${err.message}`);
    throw err;
  }
}

/**
 * Google Sheets API クライアントを取得
 * @returns {google.sheets_v4.Sheets}
 */
export async function getSheetClient() {
  const authClient = await getAuth();
  return google.sheets({ version: 'v4', auth: authClient });
}

/**
 * 指定したシートから全行データを取得（オブジェクト配列形式）
 * @param {string} spreadsheetId - スプレッドシートのID
 * @param {string} sheetName - シート名
 * @returns {Promise<Array<Object>>}
 */
export async function getRowsFromSheet(spreadsheetId, sheetName) {
  try {
    const authClient = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      logInfo(context, `⚠️ No data found in sheet "${sheetName}"`);
      return [];
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const entry = {};
      headers.forEach((key, i) => {
        entry[key] = row[i] || ''; // 欠損セルには空文字
      });
      return entry;
    });

    logInfo(context, `✅ ${data.length} rows loaded from "${sheetName}"`);
    return data;

  } catch (err) {
    logError(context, `❌ Failed to read sheet "${sheetName}": ${err.message}`);
    throw err;
  }
}
