function getTimestamp() {
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    return `[${now}]`;
  }
  
  function formatLog(level, context, message) {
    return `${getTimestamp()} [${level}] [${context}] ${message}`;
  }
  
  export function logInfo(context, message) {
    console.log(formatLog('INFO', context, message));
  }
  
  export function logError(context, message) {
    console.error(formatLog('ERROR', context, message));
  }
  