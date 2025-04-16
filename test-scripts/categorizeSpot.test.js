// test-scripts/categorizeSpot.test.js
const {
    getPrimaryCategory,
    getCategoriesFromTypes
  } = require("../app/domains/spots/categorizeSpot");
  
  describe("カテゴリ分類テスト（getPrimaryCategory / getCategoriesFromTypes）", () => {
    test("アニメ + ショッピング → primary = anime, tags = anime, shopping", () => {
      const types = ["book_store", "store"];
      expect(getPrimaryCategory(types)).toBe("anime");
      expect(getCategoriesFromTypes(types)).toEqual(expect.arrayContaining(["anime", "shopping"]));
    });
  
    test("ファッションのみ → fashion", () => {
      const types = ["clothing_store"];
      expect(getPrimaryCategory(types)).toBe("fashion");
      expect(getCategoriesFromTypes(types)).toEqual(["fashion"]);
    });
  
    test("一致なし → other", () => {
      const types = ["finance", "bank"];
      expect(getPrimaryCategory(types)).toBe("other");
      expect(getCategoriesFromTypes(types)).toEqual([]);
    });
  
    test("カフェ + フード → primary = cafe, tags = cafe, food", () => {
      const types = ["cafe", "restaurant"];
      expect(getPrimaryCategory(types)).toBe("cafe");
      expect(getCategoriesFromTypes(types)).toEqual(expect.arrayContaining(["cafe", "food"]));
    });
  
    test("未定義やnullでも落ちない", () => {
      expect(getPrimaryCategory(undefined)).toBe("other");
      expect(getCategoriesFromTypes(null)).toEqual([]);
    });
  });
  