const fs = require('fs');
const path = require('path');

// logs フォルダの作成（なければ作成）
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ログファイルパス（update.log に集約）
const logFilePath = path.join(logDir, 'update.log');

// ログの整形：日本時間 + ログレベル + コンテキスト + メッセージ
function formatLog(level, context, message) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return `[${now}] [${level}] [${context}] ${message}`;
}

// ログ出力（コンソール + ファイル）
function writeLog(level, context, message) {
  const formatted = formatLog(level, context, message);

  if (level === 'ERROR') {
    console.error(formatted);
  } else if (level === 'WARN') {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }

  fs.appendFileSync(logFilePath, formatted + '\n', 'utf8');
}

// エクスポート：共通インターフェース
module.exports = {
  logInfo: (context, message) => writeLog('INFO', context, message),
  logError: (context, messageOrError) => {
    const msg = messageOrError instanceof Error ? messageOrError.stack : messageOrError;
    writeLog('ERROR', context, msg);
  },
  logDebug: (context, message) => writeLog('DEBUG', context, message),
  logWarn: (context, message) => writeLog('WARN', context, message) // ✅ WARN 追加済み
};
