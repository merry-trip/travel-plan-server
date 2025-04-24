// app/domains/spots/enrichSpotDetails.mjs

import logger from '../../utils/logger.mjs';
import config from '../../config.mjs'; // ✅ APIキー取得

const context = 'enrichSpotDetails';

const API_KEY = config.GOOGLE_API_KEY;
const BASE_URL = 'https://places.googleapis.com/v1/places';

const FIELDS = [
  'websiteUri',
  'rating',
  'userRatingCount',
  'businessStatus',
  'currentOpeningHours.openNow',
  'regularOpeningHours.weekdayDescriptions',
  'formattedAddress',
  'primaryTypeDisplayName',
  'displayName.text',
  'priceLevel',
  'internationalPhoneNumber',
  'editorialSummary.text',
  'location'
].join(',');

/**
 * spot オブジェクトに Places API (New) の詳細情報を追記する
 * @param {Object} spot - 最低限の情報を持つ spot（placeId 必須）
 * @returns {Object} - enrich された新しい spot
 */
export async function enrichSpotDetails(spot) {
  if (!spot.placeId) {
    logger.logError(context, 'placeId is missing in spot');
    throw new Error('placeId is required for detail enrichment');
  }

  const url = `${BASE_URL}/${spot.placeId}?fields=${FIELDS}&key=${API_KEY}`;
  logger.logInfo(context, `Request URL: ${url}`);

  try {
    const res = await fetch(url);
    const json = await res.json();

    logger.logInfo(context, `Raw API response: ${JSON.stringify(json, null, 2)}`);

    if (!res.ok) {
      const errorMsg = json.error?.message || 'Unknown error';
      logger.logError(context, `Places API error: ${errorMsg}`);
      throw new Error(`Places API error: ${errorMsg}`);
    }

    const place = json;

    const enriched = {
      ...spot,
      website_url: place.websiteUri || '',
      rating: place.rating ?? null,
      ratings_count: place.userRatingCount ?? null,
      business_status: place.businessStatus || '',
      open_now: place.currentOpeningHours?.openNow ?? null,
      opening_hours: Array.isArray(place.regularOpeningHours?.weekdayDescriptions)
        ? place.regularOpeningHours.weekdayDescriptions.join(', ')
        : '',
      formatted_address: place.formattedAddress || '',
      primary_type: place.primaryTypeDisplayName?.text || '',
      display_name: place.displayName?.text || '',
      price_level: place.priceLevel ?? null,
      phone: place.internationalPhoneNumber || '',
      summary: place.editorialSummary?.text || '',
    };

    logger.logInfo(context, `Details enriched for ${spot.name || spot.placeId}`);
    return enriched;
  } catch (error) {
    logger.logError(context, error);
    throw error;
  }
}
