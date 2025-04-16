// app/domains/spots/getKeywordsFromSheet.js
require('dotenv').config();
const { getRowsFromSheet } = require('../../libs/sheets');
const logger = require('../../utils/logger');

const SHEET_NAME = process.env.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID_KEYWORDS;

module.exports = async function getKeywordsFromSheet() {
  const context = 'getKeywordsFromSheet';

  try {
    const rows = await getRowsFromSheet(SPREADSHEET_ID, SHEET_NAME);

    // status が ready の keyword だけ抽出
    const keywords = rows
      .filter(row => row.status && row.status.trim().toLowerCase() === 'ready')
      .map(row => row.keyword)
      .filter(Boolean); // 空欄を除外

    logger.logInfo(context, `🟢 ${keywords.length} keyword(s) loaded from sheet`);
    return keywords;

  } catch (err) {
    logger.logError(context, `❌ Failed to load keywords: ${err.message}`);
    return [];
  }
};
