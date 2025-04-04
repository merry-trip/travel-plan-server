// logger.js（日本時間でログを出力）

function logInfo(context, message) {
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    console.log(`[${now}] [INFO] [${context}] ${message}`);
  }
  
  function logError(context, error) {
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    console.error(`[${now}] [ERROR] [${context}] ${error.message}`);
  }
  
  module.exports = {
    logInfo,
    logError,
  };
  