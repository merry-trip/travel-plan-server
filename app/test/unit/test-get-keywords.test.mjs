// app/test/unit/test-get-keywords.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getKeywordsFromSheet } from '../../domains/spots/getKeywordsFromSheet.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../../config.mjs';

const TEST_CONTEXT = 'test-get-keywords.test.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('getKeywordsFromSheet() - キーワード取得テスト', () => {
  test('✅ キーワードを正しく取得できる', async () => {
    try {
      const keywords = await getKeywordsFromSheet();

      logInfo(TEST_CONTEXT, `✅ 読み取り成功: ${keywords.length}件`);

      // 各キーワードをログに出力
      keywords.forEach((k, i) => {
        logInfo(TEST_CONTEXT, `#${i + 1}: row=${k.rowIndex} / keyword="${k.keyword}"`);
      });

      // テスト本体
      expect(Array.isArray(keywords)).toBe(true);
      if (keywords.length > 0) {
        expect(keywords[0]).toHaveProperty('rowIndex');
        expect(keywords[0]).toHaveProperty('keyword');
      }
    } catch (err) {
      logError(TEST_CONTEXT, `❌ エラー発生: ${err.message}`);
      throw err; // テスト失敗扱い
    }
  }, 20_000); // ⏱️ 少し余裕を持ったタイムアウト設定
});
