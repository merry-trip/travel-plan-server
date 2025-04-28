// app/utils/logger.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as rfs from 'rotating-file-stream';  // 修正ポイント

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logs フォルダ作成
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日次ローテーション設定
const stream = rfs.createStream(
  (time, index) => {
    if (!time) return 'update.log';
    const date = time.toISOString().slice(0,10);
    return `update-${date}.log`;
  },
  {
    interval: '1d',
    path: logDir,
    maxFiles: 7,
    compress: 'gzip'
  }
);

function writeLog(level, context, message) {
  const now = new Date().toLocaleString('ja-JP',{ timeZone:'Asia/Tokyo' });
  const line = `[${now}] [${level}] [${context}] ${message}\n`;
  if (level === 'ERROR') {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
  stream.write(line);
}

export function logInfo(context, message)  { writeLog('INFO',  context, message); }
export function logWarn(context, message)  { writeLog('WARN',  context, message); }
export function logDebug(context, message) { writeLog('DEBUG', context, message); }
export function logError(context, error) {
  const msg = error instanceof Error ? error.stack : String(error);
  writeLog('ERROR', context, msg);
}
