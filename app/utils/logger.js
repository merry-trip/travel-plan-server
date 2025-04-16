const fs = require('fs');
const path = require('path');

// logs フォルダの作成（なければ作る）
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ログファイルパス（1つに集約）
const logFilePath = path.join(logDir, 'update.log');

// ログの整形（タイムスタンプ＋レベル＋コンテキスト＋内容）
function formatLog(level, context, message) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  return `[${now}] [${level}] [${context}] ${message}`;
}

// ログの出力（コンソール＆ファイル）
function writeLog(level, context, message) {
  const formatted = formatLog(level, context, message);

  // コンソール出力（エラーは赤、他は通常）
  if (level === 'ERROR') {
    console.error(formatted);
  } else {
    console.log(formatted);
  }

  // ファイル出力（全レベル記録）
  fs.appendFileSync(logFilePath, formatted + '\n', 'utf8');
}

// エクスポート（共通インターフェース）
module.exports = {
  logInfo: (context, message) => writeLog('INFO', context, message),
  logError: (context, messageOrError) => {
    const msg = messageOrError instanceof Error ? messageOrError.stack : messageOrError;
    writeLog('ERROR', context, msg);
  },
  logDebug: (context, message) => writeLog('DEBUG', context, message) // ←追加された関数
};
