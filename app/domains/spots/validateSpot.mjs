// app/domains/spots/validateSpot.mjs

import { logInfo, logError } from '../../utils/logger.mjs';

/**
 * スポットオブジェクトの必須チェックを行う
 * @param {Object} spot - 検証対象のスポットデータ
 * @throws {Error} - 不正なデータがある場合
 * @returns {boolean} - 有効な場合は true を返す
 */
export default function validateSpot(spot) {
  const context = 'validateSpot';

  if (!spot || typeof spot !== 'object') {
    logError(context, 'Invalid spot: not an object');
    throw new Error('Invalid spot: not an object');
  }

  const requiredFields = ['placeId', 'name', 'lat', 'lng'];

  for (const field of requiredFields) {
    if (!(field in spot)) {
      logError(context, `Missing required field: ${field}`);
      throw new Error(`Missing required field: ${field}`);
    }

    const value = spot[field];

    if (['placeId', 'name'].includes(field) && typeof value !== 'string') {
      logError(context, `Invalid type for ${field}: expected string`);
      throw new Error(`Invalid type for ${field}: expected string`);
    }

    if (['lat', 'lng'].includes(field) && typeof value !== 'number') {
      logError(context, `Invalid type for ${field}: expected number`);
      throw new Error(`Invalid type for ${field}: expected number`);
    }
  }

  logInfo(context, `✅ Spot validation passed for: ${spot.name}`);
  return true;
}
