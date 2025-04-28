// app/test/unit/batchwritespots.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { logInfo, logError } from '../../utils/logger.mjs';

// 📄 バッチスクリプトを先にインポート（＝実行される）
import '../../scripts/batch-write-spots.mjs';

const TEST_CONTEXT = 'batchwritespots.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('バッチ書き込みスクリプトテスト', () => {
  it('バッチスクリプトが例外なく実行できる', async () => {
    try {
      // スクリプトimport時にエラーが出なければここまで到達できる
      expect(true).toBe(true);
      logInfo(TEST_CONTEXT, '✅ batch-write-spots.mjs 実行成功');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ テスト失敗: ${err.message}`);
      throw err; // テスト失敗扱いにする
    }
  });
});
