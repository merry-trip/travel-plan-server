const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger'); // OK

// 現在のPATH環境変数を取得してログファイルに出力
const pathList = process.env.PATH.split(';');

logger.logInfo('debug-path', 'Writing PATH contents to path-log.txt');

fs.writeFileSync(
  path.join(__dirname, 'path-log.txt'),
  pathList.join('\n'),
  'utf8'
);

logger.logInfo('debug-path', '✅ PATHログを書き出しました: path-log.txt');
