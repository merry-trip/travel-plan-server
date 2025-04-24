// app/api/sheets.mjs

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '../config.mjs';

const context = 'sheets';

// ✅ __dirname 再現（ESM用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 認証ファイルの取得（本番は JSON 文字列から一時ファイルを作成）
let keyFilePath;

if (config.isProd) {
  const jsonContent = process.env.GOOGLE_CREDENTIALS_JSON_PROD;
  logInfo(context, `🧪 GOOGLE_CREDENTIALS_JSON_PROD の先頭20文字：${jsonContent ? jsonContent.substring(0, 20) : '❌ undefined'}`);

  if (!jsonContent) {
    const msg = '❌ GOOGLE_CREDENTIALS_JSON_PROD が取得できませんでした（undefined）';
    logError(context, msg);
    throw new Error(msg);
  }

  const tempPath = path.resolve(__dirname, '../credentials.prod.json');
  fs.writeFileSync(tempPath, jsonContent);
  keyFilePath = tempPath;
} else {
  keyFilePath = path.resolve(config.GOOGLE_CREDENTIALS_PATH);
}

const spreadsheetId = config.SHEET_ID_WEATHER;
const sheetName = config.SHEET_NAME_WEATHER;

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * 天気シート内の A2 以降のすべての行を削除（ヘッダーを残す）
 */
export async function deleteAllDataRows() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });

  const rowCount = res.data.values?.length || 0;
  if (rowCount === 0) {
    logInfo(context, '🟡 削除対象のデータ行がありません（A2以降）');
    return;
  }

  const rowNumbers = Array.from({ length: rowCount }, (_, i) => i + 2);

  const requests = rowNumbers.sort((a, b) => b - a).map(row => ({
    deleteDimension: {
      range: {
        sheetId: 0,
        dimension: 'ROWS',
        startIndex: row - 1,
        endIndex: row
      }
    }
  }));

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests }
  });

  logInfo(context, `🧹 既存データ ${rowCount} 行をすべて削除しました`);
}

/**
 * 天気ログをスプレッドシートに追記（A1から）
 * @param {Array<Array>} rows - 追記する行データ
 */
export async function appendWeatherRows(rows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  logInfo(context, `✅ ${rows.length} 行の天気データをスプレッドシートに追加しました（env: ${config.env}）`);
}
