// app/domains/spots/rowMapper.mjs

import columnOrder from './columnOrder.mjs';
import { logInfo } from '../../utils/logger.mjs';

const context = 'rowMapper';

/**
 * スポットオブジェクトをスプレッドシート1行分に変換する
 * 列順は columnOrder.mjs に準拠（必ず同期を保つこと！）
 *
 * @param {Object} spot - 保存対象のスポットデータ（DB or API由来）
 * @returns {Array<string>} - スプレッドシート1行分の値（列順通り）
 */
export function mapSpotToRow(spot) {
  const row = columnOrder.map((key) => {
    if (!(key in spot)) {
      logInfo(context, `⚠️ Missing field "${key}" in spot data`);
      return '';
    }

    const value = spot[key];

    if (value === null || value === undefined) return '';

    if (Array.isArray(value)) {
      return value.join(', ');
    }

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
