// app/domains/spots/writeSpots.js

const validateSpot = require('./validateSpot');
const { mapSpotToRow } = require('./rowMapper');
const appendRows = require('../../utils/appendRows');
const logger = require('../../utils/logger');
const config = require('../../config');

const SHEET_NAME = config.SHEET_NAME_SPOT;
const context = 'writeSpots';

/**
 * 複数のスポットをバリデーション・整形してスプレッドシートに一括保存
 *
 * @param {Array<Object>} spots - スポットデータの配列
 * @returns {Promise<void>}
 */
async function writeSpots(spots) {
  try {
    if (!Array.isArray(spots)) throw new Error('Input must be an array');
    if (!SHEET_NAME) throw new Error('SHEET_NAME_SPOT is not defined in config');

    const validRows = [];
    const failedSpots = [];

    for (const spot of spots) {
      try {
        validateSpot(spot);
        const row = mapSpotToRow(spot);
        validRows.push(row);
      } catch (err) {
        const label = spot.name || spot.placeId || 'N/A';
        logger.logError(context, `⛔ Skipped invalid spot (${label}): ${err.message}`);
        failedSpots.push(label);
      }
    }

    if (validRows.length === 0) {
      logger.logWarn(context, '⚠️ No valid spots to write.');
      return;
    }

    await appendRows(validRows, SHEET_NAME);
    logger.logInfo(context, `✅ ${validRows.length} spot(s) written to sheet.`);

    if (failedSpots.length > 0) {
      logger.logWarn(context, `⚠️ Skipped ${failedSpots.length} invalid spot(s): ${failedSpots.join(', ')}`);
    }
  } catch (err) {
    logger.logError(context, `❌ Failed to write spots: ${err.message}`);
    throw err;
  }
}

module.exports = writeSpots;
