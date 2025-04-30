// app/test/unit/enrichSpotDetails.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { enrichSpotDetails } from '../../domains/spots/enrichSpotDetails.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../../config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const TEST_CONTEXT = 'enrichSpotDetails.test.mjs';

const testSpot = {
  placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E', // Sunshine City
  name: '',
  lat: 0,
  lng: 0
};

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('enrichSpotDetails 関数テスト', () => {
  it('スポット情報を補完できること', async () => {
    try {
      const enriched = await enrichSpotDetails(testSpot);

      logInfo(TEST_CONTEXT, '✅ enrichSpotDetails 補完成功');

      console.log('\n--- 補完結果 ---');
      console.dir(enriched, { depth: 3 });

      expect(enriched).toHaveProperty('name');
      expect(enriched).toHaveProperty('lat');
      expect(enriched).toHaveProperty('lng');
      expect(typeof enriched.name).toBe('string');
      expect(typeof enriched.lat).toBe('number');
      expect(typeof enriched.lng).toBe('number');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ enrichSpotDetails テスト失敗: ${err.message}`);
      throw err; // テスト失敗扱いにする
    }
  }, 20_000); // ⏱️ API補完は多少時間がかかるので20秒タイムアウト
});
