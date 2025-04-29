// app/scripts/test-sheet-get.mjs

import { getAuthClient } from '../utils/auth.mjs';
import { logInfo, logError } from '../utils/logger.mjs';
import { fileURLToPath } from 'url';  // ★ これ追加！

const CONTEXT = 'test-sheet-get';

async function main() {
  try {
    logInfo(CONTEXT, '🚀 getAuthClient() 単体テスト開始');
    const authClient = await getAuthClient();
    logInfo(CONTEXT, '✅ getAuthClient() 完了');
  } catch (err) {
    logError(CONTEXT, `❌ エラー発生: ${err.message}`);
    throw err;
  }
}

// 🔥 正しくCLI実行か判定する（file://→パス変換してから比較）
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
