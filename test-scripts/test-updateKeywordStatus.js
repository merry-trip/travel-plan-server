// test-scripts/test-updateKeywordStatus.js
require('dotenv').config();
const { updateKeywordStatus } = require('../app/domains/keywords/updateKeywordStatus');
const { logInfo, logError } = require('../app/utils/logger');

(async () => {
  const TEST_CONTEXT = 'test-updateKeywordStatus';

  const keyword = 'Akihabara Animate'; // ✅ ここを存在するキーワードに変更してテスト
  const status = 'done'; // ✅ 'ready' や 'error' でもOK

  logInfo(TEST_CONTEXT, `🧪 テスト開始：keyword="${keyword}" を status="${status}" に更新`);

  try {
    await updateKeywordStatus(keyword, status);
    logInfo(TEST_CONTEXT, '✅ ステータス更新テスト完了');
  } catch (err) {
    logError(TEST_CONTEXT, `❌ エラー：${err.message}`);
  }
})();
