// test-scripts/completeFullSpotInfo.test.mjs

import { describe, test, expect } from 'vitest';
import { completeFullSpotInfo } from '../app/domains/spots/completeFullSpotInfo.mjs';

describe('completeFullSpotInfo 関数テスト', () => {
  test('Akihabara Animate を補完処理して例外が出ないこと', async () => {
    try {
      await completeFullSpotInfo('Akihabara Animate');
      expect(true).toBe(true); // 成功したら true
    } catch (err) {
      console.error('❌ 補完処理でエラーが発生:', err);
      expect(err).toBeNull(); // 失敗時はテストエラー
    }
  });
});
