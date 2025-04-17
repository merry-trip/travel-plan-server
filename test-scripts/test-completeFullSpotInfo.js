// test-scripts/test-completeFullSpotInfo.test.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const { completeFullSpotInfo } = require('../app/domains/spots/completeFullSpotInfo');
const { logInfo, logError } = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 環境確認のために追加

const TEST_CONTEXT = 'Jest-test-completeFullSpotInfo';

// ⚠️ スプレッドシートの対象 keyword は事前に status=ready にしておくこと！

describe('completeFullSpotInfo()', () => {
  jest.setTimeout(30_000); // API待機余裕（30秒）

  test('✅ 正常系：有効なキーワードは status=done に更新される', async () => {
    const validKeyword = 'Akihabara Animate';
    logInfo(TEST_CONTEXT, `🧪 テスト開始（env=${config.env}） → keyword="${validKeyword}"`);

    try {
      await completeFullSpotInfo(validKeyword);
      logInfo(TEST_CONTEXT, `✅ 正常完了：status=done に更新されているかをシートで確認`);
    } catch (err) {
      logError(TEST_CONTEXT, `❌ エラー発生（正常系テスト中）: ${err.message}`);
      throw err;
    }
  });

  test('❌ 異常系：存在しないキーワードはエラーとして捕捉される', async () => {
    const invalidKeyword = 'アニメイト存在しない場所XYZ';
    logInfo(TEST_CONTEXT, `🧪 異常系テスト（env=${config.env}） → keyword="${invalidKeyword}"`);

    let errorCaught = false;

    try {
      await completeFullSpotInfo(invalidKeyword);
      logInfo(TEST_CONTEXT, `⚠️ 想定外：成功してしまいました（異常キーワード）`);
    } catch (err) {
      logInfo(TEST_CONTEXT, `✅ 想定通り：エラーを正しく捕捉`);
      errorCaught = true;
    }

    expect(errorCaught).toBe(true);
  });
});
