// app/domains/spots/getKeywordsFromSheet.js

const config = require('../../config'); // ✅ config 導入で環境変数一元管理
const { getRowsFromSheet } = require('../../libs/sheets');
const logger = require('../../utils/logger');

const SHEET_NAME = config.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = config.SHEET_ID_KEYWORDS;

/**
 * スプレッドシートから status=ready のキーワード一覧を取得する
 * @returns {Promise<Array<{ rowIndex: number, keyword: string }>>}
 */
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

module.exports = { getKeywordsFromSheet };
