// test-scripts/batch-write-spots.js

// ✅ 環境変数を明示的に test に設定（保険）
process.env.APP_ENV = 'test';

const logger = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 現在の環境確認のため
const completeSpotInfo = require('../app/domains/spots/completeSpotInfo');
const writeSpots = require('../app/domains/spots/writeSpots');

const context = 'test-scripts/batch-write-spots';

const spotKeywords = [
  'Akihabara Animate',
  'Nakano Broadway',
  'Ikebukuro Sunshine City'
];

(async () => {
  logger.logInfo(context, `🚀 Test batch write started (env: ${config.env}) with ${spotKeywords.length} keywords`);

  const enrichedSpots = [];

  for (const keyword of spotKeywords) {
    try {
      const result = await completeSpotInfo(keyword);

      if (result && result.placeId && result.name) {
        enrichedSpots.push(result);
      } else {
        logger.logInfo(context, `⚠️ No spot info for "${keyword}"`);
      }

    } catch (err) {
      logger.logError(context, `❌ Failed to complete spot for "${keyword}": ${err.message}`);
    }
  }

  if (enrichedSpots.length > 0) {
    await writeSpots(enrichedSpots);
    logger.logInfo(context, `✅ Test batch write completed: ${enrichedSpots.length} spot(s) written.`);
  } else {
    logger.logInfo(context, '❌ No valid spots to write.');
  }
})();
