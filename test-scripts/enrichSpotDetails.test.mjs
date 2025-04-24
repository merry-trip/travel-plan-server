// test-scripts/enrichSpotDetails.test.mjs

import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';
import { enrichSpotDetails } from '../app/domains/spots/enrichSpotDetails.mjs';

process.env.APP_ENV = 'test'; // ✅ 明示的にテスト環境を指定

const context = 'enrichSpotDetails.test';

const spot = {
  placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E', // Sunshine City
  name: '',
  lat: 0,
  lng: 0
};

try {
  logInfo(context, `🧪 enrichSpotDetails テスト開始（env=${config.env}）`);

  const enriched = await enrichSpotDetails(spot);

  logInfo(context, '✅ enrichSpotDetails テスト成功');

  console.log('\n--- 結果 ---');
  console.dir(enriched, { depth: 3 });

} catch (err) {
  logError(context, `❌ enrichSpotDetails テスト失敗: ${err.message}`);
}
