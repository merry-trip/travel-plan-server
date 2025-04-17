// app/domains/spots/rowMapper.js

const columnOrder = require('./columnOrder');
const logger = require('../../utils/logger');

const context = 'rowMapper';

/**
 * スポットオブジェクトをスプレッドシート1行分に変換する
 * @param {Object} spot - 保存対象のスポットデータ
 * @returns {Array<string>} - 対応する列順で並べられた1行分の値
 */
function mapSpotToRow(spot) {
  const row = columnOrder.map((key) => {
    // キーが存在しない場合
    if (!(key in spot)) {
      logger.logInfo(context, `⚠️ Missing field "${key}" in spot data`);
      return '';
    }

    const value = spot[key];

    // null や undefined は空文字で返す
    if (value === null || value === undefined) {
      return '';
    }

    // 配列 → カンマ区切り文字列
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // 特殊形式のオブジェクト（{ text: "..." }）→ 中身を取り出す
    if (typeof value === 'object') {
      if ('text' in value && typeof value.text === 'string') {
        return value.text;
      }
      return JSON.stringify(value); // その他のオブジェクトはそのまま文字列化
    }

    // 文字列・数値など → そのまま返す
    return value;
  });

  return row;
}

module.exports = { mapSpotToRow };
