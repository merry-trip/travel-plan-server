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

    // ✅ 配列はカンマ区切りの文字列に変換
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // ✅ オブジェクトはJSON文字列化（tags_jsonなどを想定）
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  });

  return row;
}

module.exports = mapSpotToRow;
