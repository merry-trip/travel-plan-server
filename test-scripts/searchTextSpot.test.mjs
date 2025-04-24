// test-scripts/searchTextSpot.test.mjs

import config from '../app/config.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import { searchTextSpot } from '../app/domains/spots/searchTextSpot.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const context = 'searchTextSpot.test';

const query = 'アニメイト新宿'; // ✅ 任意の検索キーワード

try {
  logInfo(context, `🧪 SearchTextSpot テスト開始（env=${config.env}）: ${query}`);
  const result = await searchTextSpot(query);

  if (result) {
    logInfo(context, `✅ 検索成功: ${result.name} (${result.placeId})`);
    console.log('\n--- 検索結果 ---');
    console.dir(result, { depth: 3 });
  } else {
    logInfo(context, '⚠️ 該当なし（nullが返却されました）');
  }
} catch (err) {
  logError(context, `❌ テスト失敗: ${err.message}`);
}
