// app/test/unit/test-updateKeywordStatus.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { updateKeywordStatus } from '../../domains/keywords/updateKeywordStatus.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const TEST_CONTEXT = 'test-updateKeywordStatus.test.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('updateKeywordStatus() - キーワードステータス更新テスト', () => {
  test('✅ 既存キーワードのステータスを更新できる', async () => {
    const keyword = 'Akihabara Animate';
    const status = 'done';

    logInfo(TEST_CONTEXT, `🧪 更新対象: keyword="${keyword}" → status="${status}"`);

    try {
      const result = await updateKeywordStatus(keyword, status);
      logInfo(TEST_CONTEXT, '✅ ステータス更新完了');

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // 必要に応じてここでresult.successのようなプロパティチェックを追加してもOK
    } catch (err) {
      logError(TEST_CONTEXT, `❌ エラー発生: ${err.message}`);
      throw err; // テスト失敗扱い
    }
  }, 20_000); // ⏱️ 余裕を持ったタイムアウト
});
