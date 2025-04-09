// app/tools/update-category.js

require('dotenv').config();
const { google } = require('googleapis');
const { logInfo, logError } = require('../utils/logger');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME_SPOTS_DEV || 'anime_spot_db';

// カテゴリ分類ロジック
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
    { key: 'store', category: 'general_shop' } // 最後の手段
  ];  

  for (const rule of PRIORITY) {
    if (types.includes(rule.key)) return rule.category;
  }

  return 'unknown';
}

async function updateCategories() {
  logInfo('updateCategory', '📌 STEP① カテゴリ分類スクリプト開始');

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // データ取得
    const range = `${SHEET_NAME}!A2:G`; // A: name, B: lat, C: lng, D: description, E: placeId, F: types, G: source_type
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const rows = res.data.values || [];
    logInfo('updateCategory', `📌 STEP② 取得行数: ${rows.length}`);

    // 書き込みデータ準備
    const updates = [];
    for (const row of rows) {
      const name = row[0] || '(no name)';
      const placeId = row[4] || '';
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

    // category_for_map 列に書き込み（列H）
    const updateRes = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!H2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: updates,
      },
    });

    logInfo('updateCategory', `✅ STEP③ 書き込み完了（${updates.length}件）`);
  } catch (err) {
    logError('updateCategory', `❌ エラー発生: ${err.message}`);
  }
}

updateCategories();
