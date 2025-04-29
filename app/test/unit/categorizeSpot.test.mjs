// app/test/unit/categorizeSpot.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import {
  getPrimaryCategory,
  getCategoriesFromTypes
} from '../../domains/spots/categorizeSpot.mjs';
import { logInfo } from '../../utils/logger.mjs';

const TEST_CONTEXT = 'categorizeSpot.test.mjs';

beforeAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト開始');
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('カテゴリ分類テスト（getPrimaryCategory / getCategoriesFromTypes）', () => {
  test('アニメ + ショッピング → primary = anime, tags = anime, shopping', () => {
    const types = ['book_store', 'store'];
    expect(getPrimaryCategory(types)).toBe('anime');
    expect(getCategoriesFromTypes(types)).toEqual(expect.arrayContaining(['anime', 'shopping']));
  });

  test('ファッションのみ → primary = fashion, tags = fashion', () => {
    const types = ['clothing_store'];
    expect(getPrimaryCategory(types)).toBe('fashion');
    expect(getCategoriesFromTypes(types)).toEqual(['fashion']);
  });

  test('一致なし → primary = other, tags = []', () => {
    const types = ['finance', 'bank'];
    expect(getPrimaryCategory(types)).toBe('other');
    expect(getCategoriesFromTypes(types)).toEqual([]);
  });

  test('カフェ + フード → primary = cafe, tags = cafe, food', () => {
    const types = ['cafe', 'restaurant'];
    expect(getPrimaryCategory(types)).toBe('cafe');
    expect(getCategoriesFromTypes(types)).toEqual(expect.arrayContaining(['cafe', 'food']));
  });

  test('未定義やnullでもエラーにならない', () => {
    expect(getPrimaryCategory(undefined)).toBe('other');
    expect(getCategoriesFromTypes(null)).toEqual([]);
  });
});
