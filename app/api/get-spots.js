// api/get-spots.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { logInfo, logError } = require('../utils/logger'); // ✅ ロガーを追加
require('dotenv').config(); // .env読み込み

// 🔧 環境情報（dev固定でOK）
const keyFilePath = path.resolve(process.env.GOOGLE_CREDENTIALS_PATH_DEV);
const spreadsheetId = process.env.SHEET_ID_WEATHER_DEV;
const sheetName = process.env.SHEET_NAME_SPOTS_DEV;

// ✅ Google Sheets API 認証設定
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// ✅ 関数：anime_spot_db からスポット一覧を取得
async function getSpotList() {
  const context = 'get-spots'; // ログ用の処理名

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:E`, // name, lat, lng, description, placeId
    });

    const values = res.data.values || [];

    // ✅ 成功ログ（件数表示）
    logInfo(context, `スポット取得成功：${values.length}件`);

    // ✅ 先頭1件をテスト表示（開発用）
    if (values[0]) {
      logInfo(context, `先頭データ: ${JSON.stringify(values[0])}`);
    }

    // ✅ オブジェクト形式に整形して返す
    return values.map((row) => ({
      name: row[0],
      lat: parseFloat(row[1]),
      lng: parseFloat(row[2]),
      description: row[3],
      placeId: row[4],
    }));
  } catch (error) {
    // ❌ エラーログ（原因明示）
    logError(context, error);
    throw error;
  }
}

module.exports = getSpotList;
