// app/domains/spots/categorizeSpot.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 再現（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAP_PATH = path.resolve(__dirname, '../../data/category-map.json');

let categoryMap = [];

try {
  const rawData = fs.readFileSync(CATEGORY_MAP_PATH, 'utf-8');
  categoryMap = JSON.parse(rawData);
} catch (error) {
  console.error(`[categorizeSpot.mjs] ❌ category-map.json の読み込みに失敗: ${error.message}`);
  categoryMap = []; // 空配列でフォールバック
}

/**
 * 複数カテゴリを tags_json 用に抽出
 * @param {string[]} types - Google Places API からの types 配列
 * @returns {string[]} - 該当カテゴリ配列
 */
export function getCategoriesFromTypes(types = []) {
  if (!Array.isArray(types)) return [];

  const matchedCategories = new Set();

  for (const { category, keywords } of categoryMap) {
    if (keywords.some(keyword => types.includes(keyword))) {
      matchedCategories.add(category);
    }
  }

  return Array.from(matchedCategories);
}

/**
 * 最初に一致したカテゴリを category_for_map に使う
 * @param {string[]} types - Google Places API からの types 配列
 * @returns {string} - 最初に一致したカテゴリ or "other"
 */
export function getPrimaryCategory(types = []) {
  const all = getCategoriesFromTypes(types);
  return all[0] || 'other';
}
