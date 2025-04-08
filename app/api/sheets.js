// api/sheets.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { logInfo, logError } = require('../utils/logger');
require('dotenv').config();

const context = 'sheets';
const appEnv = process.env.APP_ENV || 'dev';

let keyFilePath;
if (appEnv === 'prod') {
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
  keyFilePath = path.resolve(process.env.GOOGLE_CREDENTIALS_PATH_DEV);
}

const spreadsheetId = appEnv === 'prod'
  ? process.env.SHEET_ID_WEATHER_PROD
  : process.env.SHEET_ID_WEATHER_DEV;

const sheetName = appEnv === 'prod'
  ? process.env.SHEET_NAME_WEATHER_PROD
  : process.env.SHEET_NAME_WEATHER_DEV;

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ✅ すべてのデータ行（A2以降）を削除
async function deleteAllDataRows() {
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

// ✅ 天気データを追記（A1から追加）
async function appendWeatherRows(rows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  logInfo(context, `✅ ${rows.length} 行の天気データをスプレッドシートに追加しました（env: ${appEnv}）`);
}

module.exports = {
  deleteAllDataRows,
  appendWeatherRows,
};