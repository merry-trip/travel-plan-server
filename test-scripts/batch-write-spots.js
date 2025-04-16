// test-scripts/batch-write-spots.js
require('dotenv').config();
const logger = require('../app/utils/logger');
const completeSpotInfo = require('../app/domains/spots/completeSpotInfo');
const writeSpots = require('../app/domains/spots/writeSpots');

const context = 'batch-write-spots';

// 検索キーワード一覧（本番では .env や外部ファイルから取得も可能）
const spotKeywords = [
  'Akihabara Animate',
  'Nakano Broadway',
  'Ikebukuro Sunshine City'
];

(async () => {
  logger.logInfo(context, `🚀 Batch write started with ${spotKeywords.length} keywords`);

  const enrichedSpots = [];

  for (const keyword of spotKeywords) {
    try {
      const result = await completeSpotInfo(keyword);

      if (result && result.placeId && result.name) {
        enrichedSpots.push(result); // result = enriched spot object
      } else {
        logger.logInfo(context, `⚠️ No spot info for "${keyword}"`);
      }

    } catch (err) {
      logger.logError(context, `❌ Failed to complete spot for "${keyword}": ${err.message}`);
    }
  }

  if (enrichedSpots.length > 0) {
    await writeSpots(enrichedSpots);
    logger.logInfo(context, `✅ Batch write completed: ${enrichedSpots.length} spot(s) written.`);
  } else {
    logger.logInfo(context, '❌ No valid spots to write.');
  }
})();
