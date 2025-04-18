// app/domains/spots/rowMapper.js

const columnOrder = require('./columnOrder');
const logger = require('../../utils/logger');

const context = 'rowMapper';

/**
 * スポットオブジェクトをスプレッドシート1行分に変換する
 * 列順は columnOrder.js に準拠（必ず同期を保つこと！）
 *
 * @param {Object} spot - 保存対象のスポットデータ（DB or API由来）
 * @returns {Array<string>} - スプレッドシート1行分の値（列順通り）
 */
function mapSpotToRow(spot) {
  const row = columnOrder.map((key) => {
    // 存在しないキー → 空文字（missingフィールドは logger で警告）
    if (!(key in spot)) {
      logger.logInfo(context, `⚠️ Missing field "${key}" in spot data`);
      return '';
    }

    const value = spot[key];

    // null や undefined → 空欄
    if (value === null || value === undefined) {
      return '';
    }

    // 配列型 → カンマ区切り文字列に変換
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // 特殊なオブジェクト形式 { text: "..." } → テキスト取り出し
    if (typeof value === 'object') {
      if ('text' in value && typeof value.text === 'string') {
        return value.text;
      }

      // その他のオブジェクトは JSON 文字列化（例：tags_json など）
      return JSON.stringify(value);
    }

    // 文字列 or 数値 → そのまま
    return value;
  });

  return row;
}

module.exports = { mapSpotToRow };
