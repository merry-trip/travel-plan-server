// app/domains/spots/writeSpot.js

const validateSpot = require('./validateSpot');
const { mapSpotToRow } = require('./rowMapper');
const appendRow = require('../../utils/appendRow');
const logger = require('../../utils/logger');
const config = require('../../config');

const SHEET_NAME = config.SHEET_NAME_SPOT;
const context = 'writeSpot';

/**
 * スポットデータを1件、スプレッドシートに書き込む
 * 列順は columnOrder.js に準拠。loggerで詳細記録。
 *
 * @param {Object} spot - 書き込むスポットデータ
 * @returns {Promise<void>}
 */
async function writeSpot(spot) {
  try {
    // ✅ 1. 設定確認
    if (!SHEET_NAME) {
      throw new Error('❌ SHEET_NAME_SPOT is not defined in config');
    }

    // ✅ 2. バリデーション（構造チェック）
    validateSpot(spot);

    // ✅ 3. 整形（rowに変換）
    const row = mapSpotToRow(spot);

    // ✅ 4. 書き込み実行
    await appendRow(row, SHEET_NAME);

    // ✅ 5. ログ出力（placeIdとstatusも追跡に重要）
    logger.logInfo(context, `✅ Spot written: ${spot.name} / placeId=${spot.placeId} / status=${spot.status}`);
  } catch (err) {
    logger.logError(context, `❌ Failed to write spot: ${err.message}`);
    throw err;
  }
}

module.exports = { writeSpot };
