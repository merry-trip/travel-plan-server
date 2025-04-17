// test-scripts/test-updateKeywordStatus.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const { updateKeywordStatus } = require('../app/domains/keywords/updateKeywordStatus');
const { logInfo, logError } = require('../app/utils/logger');
const config = require('../app/config'); // ✅ 環境確認用

(async () => {
  const TEST_CONTEXT = 'test-updateKeywordStatus';

  const keyword = 'Akihabara Animate'; // ✅ 存在するキーワードを指定
  const status = 'done';               // ✅ 'ready' や 'error' でも可

  logInfo(TEST_CONTEXT, `🧪 テスト開始（env=${config.env}）: keyword="${keyword}" を status="${status}" に更新`);

  try {
    await updateKeywordStatus(keyword, status);
    logInfo(TEST_CONTEXT, '✅ ステータス更新テスト完了');
  } catch (err) {
    logError(TEST_CONTEXT, `❌ エラー：${err.message}`);
  }
})();
