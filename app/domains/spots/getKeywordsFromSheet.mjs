// app/domains/spots/getKeywordsFromSheet.mjs

import config from '../../config.mjs'; // ✅ 環境変数一元管理
import { getRowsFromSheet } from '../../utils/sheets.mjs';
import { logInfo, logError } from '../../utils/logger.mjs'; // ✅ 正しいimport方法

const SHEET_NAME = config.SHEET_NAME_KEYWORDS;
const SPREADSHEET_ID = config.SHEET_ID_KEYWORDS;

/**
 * スプレッドシートから status=ready のキーワード一覧を取得する
 * @returns {Promise<Array<{ rowIndex: number, keyword: string }>>}
 */
export async function getKeywordsFromSheet() {
  const context = 'getKeywordsFromSheet';

  try {
    const rows = await getRowsFromSheet(SPREADSHEET_ID, SHEET_NAME);

    const keywords = rows
      .filter(row => row.status && row.status.trim().toLowerCase() === 'ready')
      .map((row, index) => ({
        rowIndex: index + 2, // 1行目ヘッダー＋1オフセット
        keyword: row.keyword,
      }))
      .filter(k => !!k.keyword); // 空文字は除外

    logInfo(context, `🟢 ${keywords.length} keyword(s) loaded from sheet`);
    return keywords;

  } catch (err) {
    logError(context, `❌ Failed to load keywords: ${err.message}`);
    return [];
  }
}
