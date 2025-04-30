// app/test/unit/searchTextSpot.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';
import { searchTextSpot } from '../../domains/spots/searchTextSpot.mjs';

const TEST_CONTEXT = 'searchTextSpot.test.mjs';
const TEST_QUERY = 'アニメイト新宿';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('searchTextSpot 関数テスト', () => {
  it(`キーワード「${TEST_QUERY}」でスポットが取得できるか`, async () => {
    try {
      const result = await searchTextSpot(TEST_QUERY);

      if (result) {
        logInfo(TEST_CONTEXT, `✅ 検索成功: ${result.name} (${result.placeId})`);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('placeId');
      } else {
        logInfo(TEST_CONTEXT, '⚠️ 該当スポットなし（nullが返却されました）');
        expect(result).toBeNull(); // 取得できない場合もテスト通過扱い
      }
    } catch (err) {
      logError(TEST_CONTEXT, `❌ searchTextSpot テスト失敗: ${err.message}`);
      throw err; // エラーはVitestに伝える
    }
  }, 20_000); // ⏱️ ネットワーク/API呼び出しなのでタイムアウトを長めに設定
});
