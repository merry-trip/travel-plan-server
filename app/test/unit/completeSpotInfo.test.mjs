// app/test/unit/completeSpotInfo.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { completeSpotInfo } from '../../domains/spots/completeSpotInfo.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const TEST_CONTEXT = 'completeSpotInfo.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('completeSpotInfo 関数テスト', () => {
  test('キーワード「Akihabara Animate」で補完処理が成功する', async () => {
    const inputText = 'Akihabara Animate';
    logInfo(TEST_CONTEXT, `🧪 テスト対象: "${inputText}"`);

    try {
      const result = await completeSpotInfo(inputText);

      logInfo(TEST_CONTEXT, '✅ 補完結果取得成功');
      console.dir(result, { depth: 5 });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('placeId'); // placeId が存在することを検証
      expect(result).toHaveProperty('name');    // name が存在することも検証
    } catch (err) {
      logError(TEST_CONTEXT, `❌ エラー発生: ${err.message}`);
      throw err; // テスト失敗扱い
    }
  }, 15_000); // ⏱️ 通信ありなのでタイムアウト15秒
});
