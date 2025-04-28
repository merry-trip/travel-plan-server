// test-scripts/writeWithDeepSeek.test.js
/**
 * ローカル環境で DeepSeek 補完バッチの挙動をテストするファイル
 * - logger 出力や status 更新の流れを確認
 */

const path = require('path');

// 本番用スクリプトをそのまま実行
const scriptPath = path.resolve(__dirname, '../app/scripts/writeWithDeepSeek.js');
require(scriptPath);
