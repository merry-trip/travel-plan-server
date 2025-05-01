// app/tools/archive/debug-path.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.mjs';

const context = 'debug-path';

// ✅ __dirname を ESMで再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 環境変数 PATH を取得（クロスプラットフォーム対応）
const separator = process.platform === 'win32' ? ';' : ':';
const pathList = (process.env.PATH || '').split(separator);

// ✅ 出力先パス
const outputPath = path.resolve(__dirname, '../logs/path-log.txt');

try {
  logInfo(context, `🛠 PATH内容を出力します → ${outputPath}`);
  fs.writeFileSync(outputPath, pathList.join('\n'), 'utf8');
  logInfo(context, '✅ PATHログを書き出しました');
} catch (err) {
  logError(context, `❌ PATHログの出力に失敗しました: ${err.message}`);
}
