// test-scripts/test-updateKeywordStatus.test.mjs

import { updateKeywordStatus } from '../app/domains/keywords/updateKeywordStatus.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const TEST_CONTEXT = 'test-updateKeywordStatus';

// ✅ 存在するキーワードと変更するステータスを指定
const keyword = 'Akihabara Animate';
const status = 'done';

logInfo(TEST_CONTEXT, `🧪 テスト開始（env=${config.env}）: keyword="${keyword}" を status="${status}" に更新`);

try {
  await updateKeywordStatus(keyword, status);
  logInfo(TEST_CONTEXT, '✅ ステータス更新テスト完了');
} catch (err) {
  logError(TEST_CONTEXT, `❌ エラー：${err.message}`);
}
