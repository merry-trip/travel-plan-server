// app/utils/logger.mjs（完全版：名前付きエクスポートに対応）

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logs フォルダ作成
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFilePath = path.join(logDir, 'update.log');

function formatLog(level, context, message) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return `[${now}] [${level}] [${context}] ${message}`;
}

function writeLog(level, context, message) {
  const formatted = formatLog(level, context, message);
  if (level === 'ERROR') {
    console.error(formatted);
  } else if (level === 'WARN') {
    console.warn(formatted);
  } else if (level === 'DEBUG') {
    console.debug(formatted);
  } else {
    console.log(formatted);
  }
  fs.appendFileSync(logFilePath, formatted + '\n', 'utf8');
}

// ✅ 名前付きエクスポート
export function logInfo(context, message) {
  writeLog('INFO', context, message);
}

export function logError(context, error) {
  const message = error instanceof Error ? error.stack : error;
  writeLog('ERROR', context, message);
}

export function logWarn(context, message) {
  writeLog('WARN', context, message);
}

export function logDebug(context, message) {
  writeLog('DEBUG', context, message);
}
