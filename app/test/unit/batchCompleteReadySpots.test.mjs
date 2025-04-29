// app/test/unit/batchCompleteReadySpots.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runBatchComplete } from '../../scripts/batchCompleteReadySpots.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';

const TEST_CONTEXT = 'batchCompleteReadySpots.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('runBatchComplete() - バッチ処理テスト（status=ready）', () => {
  it('バッチが例外なく完了し、正しい結果オブジェクトが返る', async () => {
    try {
      const result = await runBatchComplete();

      logInfo(TEST_CONTEXT, `✅ バッチ処理完了 → 成功: ${result.successCount}件 / 失敗: ${result.failCount}件`);

      expect(result).toHaveProperty('successCount');
      expect(result).toHaveProperty('failCount');
      expect(result).toHaveProperty('failedKeywords');

      expect(typeof result.successCount).toBe('number');
      expect(typeof result.failCount).toBe('number');
      expect(Array.isArray(result.failedKeywords)).toBe(true);

    } catch (err) {
      logError(TEST_CONTEXT, `❌ バッチ処理エラー: ${err.message}`);
      throw err; // テスト失敗として再throw
    }
  }, 20_000); // ⏱️ API系ならタイムアウト20秒推奨
});
