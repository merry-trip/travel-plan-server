require("dotenv").config();
const { completeFullSpotInfo } = require("../app/domains/spots/completeFullSpotInfo");
const { logInfo, logError } = require("../app/utils/logger");

(async () => {
  const TEST_CONTEXT = "test-completeFullSpotInfo";

  logInfo(TEST_CONTEXT, "🚀 スポット補完テストを開始（開発用スプレッドシート）");

  // ✅ 成功ケース
  const validKeyword = "Akihabara Animate";

  try {
    logInfo(TEST_CONTEXT, `🧪 テスト：成功想定 → keyword="${validKeyword}"`);
    await completeFullSpotInfo(validKeyword);
  } catch (err) {
    logError(TEST_CONTEXT, `❌ 失敗（成功テスト中）：${err.message}`);
  }

  // ✅ 失敗ケース
  const invalidKeyword = "アニメイト存在しない場所XYZ";

  try {
    logInfo(TEST_CONTEXT, `🧪 テスト：失敗想定 → keyword="${invalidKeyword}"`);
    await completeFullSpotInfo(invalidKeyword);
  } catch (err) {
    logError(TEST_CONTEXT, `❌ 失敗（失敗テスト中）：${err.message}`);
  }

  logInfo(TEST_CONTEXT, "✅ テスト完了：loggerとスプレッドシートを確認してください");
})();
