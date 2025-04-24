// test-scripts/writeWithDeepSeek.test.mjs
/**
 * ESM構成で DeepSeek 補完バッチ処理を直接テスト
 * - logger 出力、status 更新、失敗ログ含め確認可能
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📍 実行対象スクリプトの絶対パス
const scriptPath = path.resolve(__dirname, '../app/scripts/writeWithDeepSeek.mjs');

try {
  const module = await import(scriptPath);
  if (typeof module.default === 'function') {
    await module.default(); // export default main の場合
  }
} catch (err) {
  console.error('❌ DeepSeekバッチ実行エラー:', err);
}
