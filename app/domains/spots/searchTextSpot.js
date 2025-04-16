const fetch = require('node-fetch');
const logger = require('../../utils/logger');

const API_KEY = process.env.GOOGLE_API_KEY_DEV;
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

/**
 * SearchText API を使ってキーワードから placeId を取得する
 * @param {string} query - 検索キーワード（例：アニメイト新宿）
 * @returns {Promise<Object|null>} - 最初のスポット情報 or null
 */
async function searchTextSpot(query) {
  const context = 'searchTextSpot';
  const url = `${BASE_URL}?key=${API_KEY}`;

  logger.logInfo(context, `🔍 SearchText API 呼び出し: ${query}`);
  logger.logDebug(context, `Request URL: ${url}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types'
      },
      body: JSON.stringify({
        textQuery: query
      })
    });

    const json = await res.json();
    logger.logDebug(context, `Raw response: ${JSON.stringify(json)}`);

    if (json.places && json.places.length > 0) {
      const place = json.places[0];

      logger.logInfo(context, `✅ 検索ヒット: ${place.displayName?.text} (${place.id})`);

      return {
        placeId: place.id,
        name: place.displayName?.text || '',
        formatted_address: place.formattedAddress || '',
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0,
        types: place.types || [],
      };
    } else {
      logger.logInfo(context, `⚠️ 該当スポットなし: ${query}`);
      return null;
    }
  } catch (err) {
    logger.logError(context, `❌ SearchText API エラー: ${err.message}`);
    throw err;
  }
}

module.exports = {
  searchTextSpot,
};
