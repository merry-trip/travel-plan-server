// app/domains/spots/getRegionTagByLatLng.mjs

import regionBounds from '../../data/region_map_by_bounds.json' assert { type: 'json' };
import { logInfo, logError } from '../../utils/logger.mjs';

/**
 * 緯度経度から地域タグ（region_tag）を判定する
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @returns {string} region_tag（例: "kanagawa"）or 空文字
 */
export function getRegionTagByLatLng(lat, lng) {
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
