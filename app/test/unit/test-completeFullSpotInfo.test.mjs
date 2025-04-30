// app/test/unit/test-completeFullSpotInfo.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { completeFullSpotInfo } from '../../domains/spots/completeFullSpotInfo.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const TEST_CONTEXT = 'test-completeFullSpotInfo.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('completeFullSpotInfo() - スポット補完テスト', () => {

  test('✅ 正常系：有効なキーワードは status=done に更新される', async () => {
    const validKeyword = 'Akihabara Animate';
    logInfo(TEST_CONTEXT, `🧪 正常系テスト → keyword="${validKeyword}"`);

    const result = await completeFullSpotInfo(validKeyword);

    logInfo(TEST_CONTEXT, `✅ 正常完了: ${JSON.stringify(result, null, 2)}`);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.success).toBe(true);
  }, 30_000);

  test('❌ 異常系：存在しないキーワードは補完されず、success=false で返る', async () => {
    const invalidKeyword = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
    logInfo(TEST_CONTEXT, `🧪 異常系テスト → keyword="${invalidKeyword}"`);

    const result = await completeFullSpotInfo(invalidKeyword);

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/placeId not found|already exists|error/i);
    logInfo(TEST_CONTEXT, `✅ 異常系補完結果: ${JSON.stringify(result, null, 2)}`);
  }, 20_000);
});
