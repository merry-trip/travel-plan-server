// app/test/unit/logger.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { logInfo, logError } from '../../utils/logger.mjs';

const TEST_CONTEXT = 'logger.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('logger.mjs basic test', () => {
  it('logInfo 出力のテスト', () => {
    try {
      logInfo(TEST_CONTEXT, '✅ logInfo() が正常に動作しています');
      expect(true).toBe(true); // 例外が出なければOK
    } catch (err) {
      logError(TEST_CONTEXT, `❌ logInfo テストエラー: ${err.message}`);
      throw err;
    }
  });

  it('logError 出力のテスト', () => {
    try {
      throw new Error('テスト用エラー');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ 捕捉エラー発生: ${err.message}`);
      expect(err).toBeInstanceOf(Error);
    }
  });
});
