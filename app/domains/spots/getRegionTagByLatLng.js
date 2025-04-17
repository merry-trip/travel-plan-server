// app/domains/spots/getRegionTagByLatLng.js

const regionBounds = require('../../data/region_map_by_bounds.json');
const { logInfo, logError } = require('../../utils/logger');

/**
 * 緯度経度から地域タグ（region_tag）を判定する
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @returns {string} region_tag（例: "kanagawa"）or 空文字
 */
function getRegionTagByLatLng(lat, lng) {
  const context = 'getRegionTagByLatLng';

  try {
    for (const region of regionBounds) {
      const { lat_min, lat_max, lng_min, lng_max } = region.bounds;

      if (
        lat >= lat_min && lat <= lat_max &&
        lng >= lng_min && lng <= lng_max
      ) {
        logInfo(context, `✅ region_tag 判定: "${region.name}"`);
        return region.name;
      }
    }

    logInfo(context, `⚠️ region_tag 未判定（lat=${lat}, lng=${lng}）`);
    return '';
  } catch (err) {
    logError(context, `❌ エラー: ${err.message}`);
    return '';
  }
}

module.exports = { getRegionTagByLatLng };
