// app/domains/spots/getKeywordsFromSheet.js
require('dotenv').config();
const { getRowsFromSheet } = require('../../libs/sheets');
const logger = require('../../utils/logger');

const SHEET_NAME = process.env.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID_KEYWORDS;

// ✅ 名前付きで定義
async function getKeywordsFromSheet() {
  const context = 'getKeywordsFromSheet';

  try {
    const rows = await getRowsFromSheet(SPREADSHEET_ID, SHEET_NAME);

    // status=ready の keyword だけ抽出
    const keywords = rows
      .filter(row => row.status && row.status.trim().toLowerCase() === 'ready')
      .map((row, index) => ({
        rowIndex: index + 2, // 1行目ヘッダー＋1オフセット
        keyword: row.keyword,
      }))
      .filter(k => !!k.keyword); // 空を除外

    logger.logInfo(context, `🟢 ${keywords.length} keyword(s) loaded from sheet`);
    return keywords;

  } catch (err) {
    logger.logError(context, `❌ Failed to load keywords: ${err.message}`);
    return [];
  }
}

// ✅ 明示的にオブジェクトとしてエクスポート
module.exports = { getKeywordsFromSheet };
