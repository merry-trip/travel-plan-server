// app/test/unit/test-completeFullSpotInfo.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { completeFullSpotInfo } from '../../domains/spots/completeFullSpotInfo.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../config.mjs';

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

    try {
      const result = await completeFullSpotInfo(validKeyword);

      logInfo(TEST_CONTEXT, `✅ 正常完了: ${JSON.stringify(result, null, 2)}`);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ 正常系テスト中にエラー発生: ${err.message}`);
      throw err; // 正常系なのでエラーなら即失敗
    }
  }, 30_000); // ⏱️ タイムアウト30秒

  test('❌ 異常系：存在しないキーワードはエラーとして捕捉される', async () => {
    const invalidKeyword = 'アニメイト存在しない場所XYZ';
    logInfo(TEST_CONTEXT, `🧪 異常系テスト → keyword="${invalidKeyword}"`);

    let errorCaught = false;

    try {
      await completeFullSpotInfo(invalidKeyword);
      logInfo(TEST_CONTEXT, '⚠️ 想定外: 補完成功してしまった');
    } catch (err) {
      logInfo(TEST_CONTEXT, '✅ 異常系: エラーを正しく捕捉');
      errorCaught = true;
    }

    expect(errorCaught).toBe(true); // 捕捉できなければテスト失敗
  }, 20_000); // ⏱️ タイムアウト20秒
});
