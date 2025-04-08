// api/sheets.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { logInfo, logError } = require('../utils/logger'); // ✅ 追加
require('dotenv').config();

const context = 'sheets'; // ✅ 全関数共通のログ文脈

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

// A列だけ取得 → { timestamp: rowNum } mapを返す
async function getExistingTimestampsWithRowNumbers() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });

  const values = res.data.values || [];

  const map = {};
  values.forEach((row, index) => {
    const dt = row[0];
    if (dt) {
      map[dt] = index + 2;
    }
  });

  logInfo(context, `📌 既存タイムスタンプ取得：${Object.keys(map).length} 件`);
  return map;
}

// 指定行番号を削除（複数）
async function deleteRows(rowNumbers) {
  if (rowNumbers.length === 0) {
    logInfo(context, '🟡 削除対象なし');
    return;
  }

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

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

  logInfo(context, `🧹 古いデータ ${rowNumbers.length} 件を削除しました`);
}

// 過去のデータ行を削除（今日より前）
async function deleteOldRowsBeforeToday() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });

  const values = res.data.values || [];
  const todayStr = new Date().toISOString().slice(0, 10);

  const rowNumbersToDelete = [];

  values.forEach((row, index) => {
    const dt_txt = row[0];
    if (dt_txt && dt_txt.slice(0, 10) < todayStr) {
      rowNumbersToDelete.push(index + 2);
    }
  });

  if (rowNumbersToDelete.length > 0) {
    await deleteRows(rowNumbersToDelete);
    logInfo(context, `🗑 過去データ ${rowNumbersToDelete.length} 行を削除しました`);
  } else {
    logInfo(context, '✅ 過去のデータはありませんでした');
  }
}

// 📌 追記：最新40件のみに絞り込む
async function keepLatestRowsOnly(maxRows = 40) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  // A列（日時）を取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });

  const values = res.data.values || [];

  // ソート用に { rowNum, timestamp } を作る
  const datedRows = values.map((row, index) => ({
    rowNum: index + 2,
    timestamp: row[0],
  }));

  // 日時で新しい順にソート
  datedRows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 最新40件を残し、それ以外を削除
  const rowsToDelete = datedRows.slice(maxRows).map(r => r.rowNum);
  if (rowsToDelete.length > 0) {
    await deleteRows(rowsToDelete);
    logInfo(context, `🧹 最新${maxRows}件を残し、古い${rowsToDelete.length}行を削除しました`);
  } else {
    logInfo(context, '✅ 行数制限により削除対象なし（最新40件以内）');
  }
}

// 天気データを追記
async function appendWeatherRows(rows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  logInfo(context, `✅ ${rows.length} 行の天気データをスプレッドシートに追加（env: ${appEnv}）`);
}

module.exports = {
  appendWeatherRows,
  getExistingTimestampsWithRowNumbers,
  deleteRows,
  deleteOldRowsBeforeToday,
  keepLatestRowsOnly, // ✅ この行を追加！
};
