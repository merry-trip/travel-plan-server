const validateSpot = require('./validateSpot');
const mapSpotToRow = require('./rowMapper');
const appendRows = require('../../utils/appendRows'); // 複数行対応ユーティリティ
const logger = require('../../utils/logger');

const SHEET_NAME = 'spots';
const context = 'writeSpots';

/**
 * スポットデータの配列をバリデーション・整形してスプレッドシートに一括追加
 * @param {Array<Object>} spots
 * @returns {Promise<void>}
 */
async function writeSpots(spots) {
  try {
    if (!Array.isArray(spots)) throw new Error('Input must be an array');

    const validRows = [];

    for (const spot of spots) {
      try {
        validateSpot(spot);
        const row = mapSpotToRow(spot);
        validRows.push(row);
      } catch (err) {
        logger.logError(context, `Skipped invalid spot (${spot.name || 'N/A'}): ${err.message}`);
      }
    }

    if (validRows.length === 0) {
      logger.logInfo(context, 'No valid spots to write.');
      return;
    }

    await appendRows(validRows, SHEET_NAME);
    logger.logInfo(context, `✅ ${validRows.length} spot(s) written to sheet.`);
  } catch (err) {
    logger.logError(context, `❌ Failed to write spots: ${err.message}`);
    throw err;
  }
}

module.exports = writeSpots;
