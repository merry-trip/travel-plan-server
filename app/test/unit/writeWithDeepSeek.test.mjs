// app/test/unit/writeWithDeepSeek.test.mjs

import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { logInfo, logError } from '../../utils/logger.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const TEST_CONTEXT = 'writeWithDeepSeek.test.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📍 実行対象スクリプトの絶対パス
const scriptPath = path.resolve(__dirname, '../../scripts/writeWithDeepSeek.mjs');

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('DeepSeekバッチスクリプトテスト', () => {
  it('writeWithDeepSeek.mjs が例外なく実行できる', async () => {
    try {
      const module = await import(scriptPath);

      expect(module).toBeDefined();
      expect(typeof module.default).toBe('function');

      await module.default(); // default export の main関数を実行

      logInfo(TEST_CONTEXT, '✅ writeWithDeepSeek.mjs 実行成功');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ バッチ実行エラー: ${err.message}`);
      throw err; // テスト失敗扱い
    }
  }, 30_000); // ⏱️ DeepSeekは重めなので30秒タイムアウト
});
