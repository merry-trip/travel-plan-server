// api/sheets.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// 環境（dev or prod）を読み取る
const appEnv = process.env.APP_ENV || 'dev';

let keyFilePath;

if (appEnv === 'prod') {
  const jsonContent = process.env.GOOGLE_CREDENTIALS_JSON_PROD;
  const tempPath = path.resolve(__dirname, '../credentials.prod.json');
  fs.writeFileSync(tempPath, jsonContent);
  keyFilePath = tempPath;
} else {
  keyFilePath = path.resolve(process.env.GOOGLE_CREDENTIALS_PATH_DEV);
}
// スプレッドシートのIDとシート名を切り替え
const spreadsheetId = appEnv === 'prod'
  ? process.env.SHEET_ID_WEATHER_PROD
  : process.env.SHEET_ID_WEATHER_DEV;

const sheetName = appEnv === 'prod'
  ? process.env.SHEET_NAME_WEATHER_PROD
  : process.env.SHEET_NAME_WEATHER_DEV;

// 認証の設定（Google公式）
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// 複数行の天気データをスプレッドシートに追加
async function appendWeatherRows(rows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows,
    },
  });

  console.log(`✅ スプレッドシートに ${rows.length} 行の天気データを追加しました！（環境: ${appEnv}）`);
}

module.exports = { appendWeatherRows };
