// app/domains/spots/validateSpot.js

const logger = require('../../utils/logger');

/**
 * スポットオブジェクトの必須チェックを行う
 * @param {Object} spot - 検証対象のスポットデータ
 * @throws {Error} - 不正なデータがある場合
 * @returns {boolean} - 有効な場合は true を返す
 */
function validateSpot(spot) {
  const context = 'validateSpot';

  if (!spot || typeof spot !== 'object') {
    logger.logError(context, 'Invalid spot: not an object');
    throw new Error('Invalid spot: not an object');
  }

  const requiredFields = ['placeId', 'name', 'lat', 'lng'];

  for (const field of requiredFields) {
    if (!(field in spot)) {
      logger.logError(context, `Missing required field: ${field}`);
      throw new Error(`Missing required field: ${field}`);
    }

    const value = spot[field];

    if (['placeId', 'name'].includes(field) && typeof value !== 'string') {
      logger.logError(context, `Invalid type for ${field}: expected string`);
      throw new Error(`Invalid type for ${field}: expected string`);
    }

    if (['lat', 'lng'].includes(field) && typeof value !== 'number') {
      logger.logError(context, `Invalid type for ${field}: expected number`);
      throw new Error(`Invalid type for ${field}: expected number`);
    }
  }

  logger.logInfo(context, `✅ Spot validation passed for: ${spot.name}`);
  return true;
}

module.exports = validateSpot;
