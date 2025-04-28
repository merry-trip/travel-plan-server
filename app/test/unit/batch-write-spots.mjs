// app/test/unit/batch-write-spots.mjs

import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../config.mjs';
import completeSpotInfo from '../../domains/spots/completeSpotInfo.mjs';
import writeSpots from '../../domains/spots/writeSpots.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const TEST_CONTEXT = 'batch-write-spots.mjs';

const spotKeywords = [
  'Akihabara Animate',
  'Nakano Broadway',
  'Ikebukuro Sunshine City',
];

const enrichedSpots = [];

async function runBatchWriteSpots() {
  logInfo(TEST_CONTEXT, `🚀 バッチ書き込み開始 (env=${config.env}) → ${spotKeywords.length} keywords`);

  for (const keyword of spotKeywords) {
    try {
      const result = await completeSpotInfo(keyword);

      if (result && result.placeId && result.name) {
        enrichedSpots.push(result);
        logInfo(TEST_CONTEXT, `✅ 補完成功: "${keyword}"`);
      } else {
        logInfo(TEST_CONTEXT, `⚠️ スポット情報なし: "${keyword}"`);
      }

    } catch (err) {
      logError(TEST_CONTEXT, `❌ スポット補完失敗: "${keyword}" → ${err.message}`);
    }
  }

  if (enrichedSpots.length > 0) {
    try {
      await writeSpots(enrichedSpots);
      logInfo(TEST_CONTEXT, `✅ スプレッドシート書き込み完了: ${enrichedSpots.length}件`);
    } catch (err) {
      logError(TEST_CONTEXT, `❌ スプレッドシート書き込み失敗: ${err.message}`);
    }
  } else {
    logInfo(TEST_CONTEXT, '⚠️ 書き込み対象スポットが存在しませんでした');
  }
}

// 🔥 実行
await runBatchWriteSpots();
