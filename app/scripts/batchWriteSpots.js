// app/scripts/batchWriteSpots.js

const { completeSpotInfo } = require('../domains/spots/completeSpotInfo');
const { logger } = require('../utils/logger');
require('dotenv').config();

async function main() {
  try {
    logger.logInfo('バッチ開始: スポット情報の取得と保存');

    const result = await completeSpotInfo(); // keywordsの取得 → 検索 → enrich → 書き込み

    logger.logInfo('バッチ完了', {
      件数: result.length,
    });
  } catch (error) {
    logger.logError('バッチ実行中にエラーが発生しました', { error });
    process.exit(1);
  }
}

main();
