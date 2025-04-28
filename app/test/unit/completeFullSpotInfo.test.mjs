// app/test/unit/completeFullSpotInfo.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { completeFullSpotInfo } from '../../domains/spots/completeFullSpotInfo.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';

const TEST_CONTEXT = 'completeFullSpotInfo.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('completeFullSpotInfo 関数テスト', () => {
  test('Akihabara Animate を補完できる（例外が発生しないこと）', async () => {
    const keyword = 'Akihabara Animate';
    logInfo(TEST_CONTEXT, `🧪 テスト対象キーワード: "${keyword}"`);

    try {
      const result = await completeFullSpotInfo(keyword);

      logInfo(TEST_CONTEXT, `✅ 完了結果: ${JSON.stringify(result, null, 2)}`);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status'); // 補完結果に "status" が含まれること
      expect(['done', 'failed']).toContain(result.status); // さらにstatusの値も検証
    } catch (err) {
      logError(TEST_CONTEXT, `❌ エラー発生: ${err.message}`);
      throw err;
    }
  }, 20_000); // ⏱️ API呼び出しが絡むのでタイムアウト20秒に設定
});
