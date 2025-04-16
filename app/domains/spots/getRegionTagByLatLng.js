// app/domains/spots/getRegionTagByLatLng.js

const regionBounds = require('../../data/region_map_by_bounds.json');
const { logInfo, logError } = require('../../utils/logger');

function getRegionTagByLatLng(lat, lng) {
  const context = 'getRegionTagByLatLng';

  try {
    for (const region of regionBounds) {
      const { lat_min, lat_max, lng_min, lng_max } = region.bounds;

      if (
        lat >= lat_min && lat <= lat_max &&
        lng >= lng_min && lng <= lng_max
      ) {
        logInfo(context, `✅ region_tag="${region.name}" 判定`);
        return region.name;
      }
    }

    logInfo(context, `⚠️ region_tag未判定（lat: ${lat}, lng: ${lng}）`);
    return '';
  } catch (err) {
    logError(context, err);
    return '';
  }
}

module.exports = { getRegionTagByLatLng };
