// test-scripts/batch-write-spots.mjs

import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';
import completeSpotInfo from '../app/domains/spots/completeSpotInfo.mjs';
import writeSpots from '../app/domains/spots/writeSpots.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示（保険）

const context = 'test-scripts/batch-write-spots';

const spotKeywords = [
  'Akihabara Animate',
  'Nakano Broadway',
  'Ikebukuro Sunshine City'
];

const enrichedSpots = [];

logInfo(context, `🚀 Test batch write started (env: ${config.env}) with ${spotKeywords.length} keywords`);

for (const keyword of spotKeywords) {
  try {
    const result = await completeSpotInfo(keyword);

    if (result && result.placeId && result.name) {
      enrichedSpots.push(result);
    } else {
      logInfo(context, `⚠️ No spot info for "${keyword}"`);
    }

  } catch (err) {
    logError(context, `❌ Failed to complete spot for "${keyword}": ${err.message}`);
  }
}

if (enrichedSpots.length > 0) {
  await writeSpots(enrichedSpots);
  logInfo(context, `✅ Test batch write completed: ${enrichedSpots.length} spot(s) written.`);
} else {
  logInfo(context, '❌ No valid spots to write.');
}
