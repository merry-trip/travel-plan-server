// app/test/unit/deepSeek.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { completeWithDeepSeek } from '../../domains/spots/completeWithDeepSeek.mjs';
import { updateSpotDetails } from '../../domains/spots/updateSpotDetails.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../../config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const TEST_CONTEXT = 'deepSeek.test.mjs';

const testSpot = {
  placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E', // Sunshine City
  name: 'Sunshine City',
  primary_type: 'Shopping Mall',
  types: ['shopping_mall', 'aquarium'],
};

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('completeWithDeepSeek 関数テスト', () => {
  it('DeepSeekでスポット補完と（可能なら）上書き保存ができる', async () => {
    try {
      const enriched = await completeWithDeepSeek(testSpot);

      logInfo(TEST_CONTEXT, '✅ 補完結果取得');
      console.log('\n--- 補完された内容 ---');
      console.log('📌 description:', enriched.description);
      console.log('📌 short_tip_en:', enriched.short_tip_en);
      console.log('📌 status:', enriched.ai_description_status);

      expect(enriched).toHaveProperty('description');
      expect(enriched).toHaveProperty('short_tip_en');
      expect(enriched).toHaveProperty('ai_description_status');

      if (enriched.ai_description_status === 'done') {
        logInfo(TEST_CONTEXT, '📝 ステータスdone → updateSpotDetails()実行');
        await updateSpotDetails(enriched);
        logInfo(TEST_CONTEXT, '✅ 上書き保存成功');
      } else {
        logInfo(TEST_CONTEXT, '⚠️ ステータスfailed → 上書きスキップ');
      }

    } catch (err) {
      logError(TEST_CONTEXT, `❌ DeepSeekテスト失敗: ${err.message}`);
      throw err; // テストをfail扱いにする
    }
  }, 30_000); // ⏱️ DeepSeekは重いので30秒タイムアウト
});
