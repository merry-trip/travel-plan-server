// app/domains/spots/writeSpot.js
const validateSpot = require('./validateSpot');
const mapSpotToRow = require('./rowMapper');
const appendRow = require('../../utils/appendRow');
const logger = require('../../utils/logger');

const SHEET_NAME = 'spots';
const context = 'writeSpot';

/**
 * スポットデータを1件、スプレッドシートに書き込む
 * @param {Object} spot - 書き込むスポットデータ
 * @returns {Promise<void>}
 */
async function writeSpot(spot) {
  try {
    // ✅ 1. バリデーション
    validateSpot(spot);

    // ✅ 2. 整形（行データに変換）
    const row = mapSpotToRow(spot);

    // ✅ 3. スプレッドシートに追記
    await appendRow(row, SHEET_NAME);

    logger.logInfo(context, `Spot written: ${spot.name}`);
  } catch (err) {
    logger.logError(context, `Failed to write spot: ${err.message}`);
    throw err;
  }
}

module.exports = writeSpot;