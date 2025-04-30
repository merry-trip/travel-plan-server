// app/test/unit/writeSpot.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { writeSpot } from '../../domains/spots/writeSpot.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const TEST_CONTEXT = 'writeSpot.test.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

// ✅ テスト用スポットデータ
const spot = {
  placeId: 'test123',
  name: 'Test Spot',
  lat: 35.6895,
  lng: 139.6917,
  status: 'done', // ✅ 状態を追加してログ追跡しやすくする
};

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('writeSpot() - スポット書き込みテスト', () => {
  test('✅ スポット情報を例外なく書き込める', async () => {
    try {
      const result = await writeSpot(spot);

      logInfo(TEST_CONTEXT, '✅ writeSpot 成功');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ writeSpot テスト失敗: ${err.message}`);
      throw err; // エラーをVitestに伝える（テスト失敗扱い）
    }
  }, 20_000); // ⏱️ 書き込み処理なので20秒タイムアウト
});
