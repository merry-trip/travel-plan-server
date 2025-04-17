// app/domains/spots/searchTextSpot.js

const fetch = require('node-fetch');
const config = require('../../config'); // ✅ config導入でAPIキー管理
const { logInfo, logError, logDebug, logWarn } = require('../../utils/logger');

const API_KEY = config.GOOGLE_API_KEY;
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

/**
 * SearchText API を使ってキーワードから placeId を取得する
 * @param {string} query - 検索キーワード（例：アニメイト新宿）
 * @returns {Promise<Object|null>} - 最初のスポット情報 or null
 */
async function searchTextSpot(query) {
  const context = 'searchTextSpot';
  const url = `${BASE_URL}?key=${API_KEY}`;

  logInfo(context, `🔍 SearchText API 呼び出し: ${query}`);
  logDebug(context, `Request URL: ${url}`);

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
    logDebug(context, `Raw response: ${JSON.stringify(json)}`);

    if (json.places && json.places.length > 0) {
      const place = json.places[0];
      const matchedName = place.displayName?.text || '';

      logInfo(context, `✅ 検索ヒット: ${matchedName} (${place.id})`);

      // ✅ 名前が完全一致しない場合は WARN を出す（ケース区別せず）
      const normalizedQuery = query.trim().toLowerCase();
      const normalizedName = matchedName.trim().toLowerCase();
      if (normalizedQuery !== normalizedName) {
        logWarn(context, `⚠️ 入力キーワードと取得スポット名が異なります: query="${query}" / matched="${matchedName}"`);
      }

      return {
        placeId: place.id,
        name: matchedName,
        formatted_address: place.formattedAddress || '',
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0,
        types: place.types || [],
      };
    } else {
      logInfo(context, `⚠️ 該当スポットなし: ${query}`);
      return null;
    }
  } catch (err) {
    logError(context, `❌ SearchText API エラー: ${err.message}`);
    throw err;
  }
}

module.exports = { searchTextSpot };
