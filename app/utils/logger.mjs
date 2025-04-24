// app/utils/logger.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM環境でも __dirname を再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logs フォルダを作成（なければ）
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ログファイル：update.log に出力
const logFilePath = path.join(logDir, 'update.log');

/**
 * ログを整形：日時（日本時間）+ レベル + コンテキスト + メッセージ
 */
function formatLog(level, context, message) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return `[${now}] [${level}] [${context}] ${message}`;
}

/**
 * ログ出力（console + ファイル）
 */
function writeLog(level, context, message) {
  const formatted = formatLog(level, context, message);

  // コンソール出力
  switch (level) {
    case 'ERROR':
      console.error(formatted);
      break;
    case 'WARN':
      console.warn(formatted);
      break;
    case 'DEBUG':
      console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }

  // ファイルにも書き込む
  fs.appendFileSync(logFilePath, formatted + '\n', 'utf8');
}

// export：loggerオブジェクトとして提供
export default {
  logInfo: (context, message) => writeLog('INFO', context, message),
  logError: (context, messageOrError) => {
    const msg = messageOrError instanceof Error ? messageOrError.stack : messageOrError;
    writeLog('ERROR', context, msg);
  },
  logWarn: (context, message) => writeLog('WARN', context, message),
  logDebug: (context, message) => writeLog('DEBUG', context, message),
};
