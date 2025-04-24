// app/scripts/batchWriteSpots.mjs

import completeSpotInfo from '../domains/spots/completeSpotInfo.mjs';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '../config.mjs';

const CONTEXT = 'batchWriteSpots';

async function main() {
  try {
    logInfo(CONTEXT, '🚀 バッチ開始: スポット情報の取得と保存');

    const result = await completeSpotInfo(); // 例：スポット情報の取得 → enrich → 書き込み

    const count = Array.isArray(result) ? result.length : 1;
    logInfo(CONTEXT, `✅ バッチ完了: 件数=${count}`);
  } catch (error) {
    logError(CONTEXT, `❌ バッチ実行中にエラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}

// ✅ APP_ENV=test の場合は自動実行しない
if (config.env !== 'test') {
  main();
}
