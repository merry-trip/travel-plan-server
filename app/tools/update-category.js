// app/tools/update-category.js

const { google } = require('googleapis');
const { logInfo, logError } = require('../utils/logger');
const config = require('../config'); // ✅ config導入

const SPREADSHEET_ID = config.SPREADSHEET_ID_SPOTS;
const SHEET_NAME = config.SHEET_NAME_SPOTS;

/**
 * カテゴリ分類ルールに基づき types からカテゴリを決定
 * @param {string[]} types
 * @returns {string} category
 */
function determineCategory(types) {
  if (!types || types.length === 0) return 'unknown';

  const PRIORITY = [
    { key: 'book_store', category: 'book' },
    { key: 'movie_rental', category: 'rental' },
    { key: 'clothing_store', category: 'fashion' },
    { key: 'electronics_store', category: 'electronics_store' },
    { key: 'hobby_store', category: 'hobby' },
    { key: 'home_goods_store', category: 'home_goods' },
    { key: 'cafe', category: 'cafe' },
    { key: 'karaoke', category: 'entertainment' },
    { key: 'night_club', category: 'night' },
    { key: 'bar', category: 'night' },
    { key: 'shopping_mall', category: 'mall' },
    { key: 'gift_shop', category: 'gift' },
    { key: 'art_gallery', category: 'art' },
    { key: 'store', category: 'general_shop' }
  ];

  for (const rule of PRIORITY) {
    if (types.includes(rule.key)) return rule.category;
  }

  return 'unknown';
}

/**
 * メイン処理：カテゴリ分類結果をスプレッドシートに書き込む
 */
async function updateCategories() {
  logInfo('updateCategory', '📌 STEP① カテゴリ分類スクリプト開始');

  const auth = new google.auth.GoogleAuth({
    keyFile: config.GOOGLE_CREDENTIALS_PATH, // ✅ 安全な認証パス指定
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const range = `${SHEET_NAME}!A2:G`;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range
    });

    const rows = res.data.values || [];
    logInfo('updateCategory', `📌 STEP② 取得行数: ${rows.length}`);

    const updates = [];
    for (const row of rows) {
      const name = row[0] || '(no name)';
      const typesJson = row[5] || '[]';
      let types;

      try {
        types = JSON.parse(typesJson);
      } catch {
        logError('updateCategory', `❌ JSONパース失敗: ${name} (${typesJson})`);
        types = [];
      }

      const category = determineCategory(types);
      updates.push([category]);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!H2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: updates }
    });

    logInfo('updateCategory', `✅ STEP③ 書き込み完了（${updates.length}件）`);
  } catch (err) {
    logError('updateCategory', `❌ エラー発生: ${err.message}`);
  }
}

updateCategories();
