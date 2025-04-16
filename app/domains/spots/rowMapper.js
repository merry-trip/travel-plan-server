// app/domains/spots/rowMapper.js
const columnOrder = require('./columnOrder');
const logger = require('../../utils/logger');

const context = 'rowMapper';

/**
 * スポットデータを 1行分の配列にマッピングする
 * @param {Object} spot - スポットオブジェクト
 * @returns {Array} - スプレッドシート1行分のデータ
 */
function mapSpotToRow(spot) {
  const row = columnOrder.map((key) => {
    if (!(key in spot)) {
      logger.logInfo(context, `Missing field "${key}" in spot data`);
      return '';
    }

    const value = spot[key];

    if (value === null || value === undefined) {
      return '';
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // ✅ オブジェクトが { text: '...' } の場合だけ中身を返す
    if (typeof value === 'object') {
      if ('text' in value && typeof value.text === 'string') {
        return value.text;
      }
      return JSON.stringify(value);
    }

    return value;
  });

  return row;
}

module.exports = { mapSpotToRow }; // ✅ ここを追加！
