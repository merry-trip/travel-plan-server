// app/scripts/batchWriteSpots.js

const { completeSpotInfo } = require('../domains/spots/completeSpotInfo');
const { logInfo, logError } = require('../utils/logger');
const config = require('../config'); // ✅ config導入（将来的なAPP_ENV分岐用）

const CONTEXT = 'batchWriteSpots';

async function main() {
  try {
    logInfo(CONTEXT, '🚀 バッチ開始: スポット情報の取得と保存');

    const result = await completeSpotInfo(); // keywordsの取得 → 検索 → enrich → 書き込み

    logInfo(CONTEXT, '✅ バッチ完了', {
      件数: result.length,
    });
  } catch (error) {
    logError(CONTEXT, '❌ バッチ実行中にエラーが発生しました', { error });
    process.exit(1);
  }
}

main();
