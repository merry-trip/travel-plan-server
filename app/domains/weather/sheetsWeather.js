// app/domains/weather/sheetsWeather.js

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { logInfo, logError } = require('../../utils/logger');
const config = require('../../config'); // ✅ config導入

const context = 'domains/weather/sheetsWeather';

logInfo(context, `現在の環境: ${config.env}`);

let keyFilePath;

if (config.isProd) {
  const jsonContent = process.env.GOOGLE_CREDENTIALS_JSON_PROD;
  logInfo(context, `🧪 GOOGLE_CREDENTIALS_JSON_PROD の先頭20文字：${jsonContent ? jsonContent.substring(0, 20) : '❌ undefined'}`);

  if (!jsonContent) {
    const msg = '❌ GOOGLE_CREDENTIALS_JSON_PROD が取得できませんでした（undefined）';
    logError(context, msg);
    throw new Error(msg);
  }

  const tempPath = path.resolve(__dirname, '../../credentials.prod.json');
  fs.writeFileSync(tempPath, jsonContent);
  keyFilePath = tempPath;
} else {
  keyFilePath = path.resolve(config.GOOGLE_CREDENTIALS_PATH); // ✅ 開発用の安全な参照
}

const spreadsheetId = config.SPREADSHEET_ID_WEATHER;
const sheetName = config.SHEET_NAME_WEATHER;

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * A2以降の全データ行を削除する
 */
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

/**
 * 天気データを A1 から追記する
 * @param {Array<Array>} rows - 書き込むデータ行
 */
async function appendWeatherRows(rows) {
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

module.exports = {
  deleteAllDataRows,
  appendWeatherRows,
};
