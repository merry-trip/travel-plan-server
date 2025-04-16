// app/domains/spots/categorizeSpot.js
const fs = require("fs");
const path = require("path");

const categoryMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../data/category-map.json"), "utf-8")
);

/**
 * 複数カテゴリを tags_json 用に抽出
 */
function getCategoriesFromTypes(types = []) {
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
 */
function getPrimaryCategory(types = []) {
  const all = getCategoriesFromTypes(types);
  return all[0] || "other";
}

module.exports = {
  getCategoriesFromTypes,
  getPrimaryCategory
};
