// app/tools/debug-path.js

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger'); // ✅ logger統一

const context = 'debug-path';

// ✅ 環境変数 PATH を取得（クロスプラットフォーム対応）
const separator = process.platform === 'win32' ? ';' : ':';
const pathList = (process.env.PATH || '').split(separator);

// ✅ ログファイルの保存先（logs ディレクトリ内）
const outputPath = path.resolve(__dirname, '../logs/path-log.txt');

try {
  logger.logInfo(context, `🛠 PATH内容を出力します → ${outputPath}`);

  fs.writeFileSync(outputPath, pathList.join('\n'), 'utf8');

  logger.logInfo(context, '✅ PATHログを書き出しました');
} catch (err) {
  logger.logError(context, `❌ PATHログの出力に失敗しました: ${err.message}`);
}
