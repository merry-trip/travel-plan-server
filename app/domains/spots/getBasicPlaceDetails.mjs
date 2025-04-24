// app/domains/spots/getBasicPlaceDetails.mjs

import logger from '../../utils/logger.mjs';
import config from '../../config.mjs';

const context = 'getBasicPlaceDetails';
const API_KEY = config.GOOGLE_API_KEY;
const BASE_URL = 'https://places.googleapis.com/v1/places';

const FIELDS = [
  'rating',
  'userRatingCount',
  'currentOpeningHours.openNow',
  'currentOpeningHours.weekdayDescriptions' // ← opening_hoursに相当
].join(',');

/**
 * 指定placeIdの rating / ratings_count / open_now を取得
 * @param {string} placeId
 * @returns {Object} rating情報のみのオブジェクト
 */
export default async function getBasicPlaceDetails(placeId) {
  const url = `${BASE_URL}/${placeId}?fields=${FIELDS}&key=${API_KEY}`;
  logger.logInfo(context, `Requesting ${url}`);

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      const errorMsg = json.error?.message || 'Unknown error';
      logger.logError(context, `API Error: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    const result = {
      rating: json.rating ?? null,
      ratings_count: json.userRatingCount ?? null,
      open_now: json.currentOpeningHours?.openNow ?? null,
      opening_hours: json.currentOpeningHours?.weekdayDescriptions ?? null,
    };    

    logger.logInfo(context, `Result for ${placeId}: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    logger.logError(context, err.message);
    throw err;
  }
}
