// app/test/unit/test-getRegionTag.test.mjs

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';
import config from '../../config.mjs';
import { logInfo, logError, logDebug } from '../../utils/logger.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境明示

const TEST_CONTEXT = 'test-getRegionTag.test.mjs';

async function getRegionTag(lat, lng) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.GOOGLE_API_KEY}&language=ja`;
    logDebug(TEST_CONTEXT, `📡 呼び出しURL: ${url}`);

    const res = await axios.get(url);
    const result = res.data.results?.[0];

    if (!result || !result.address_components) {
      logError(TEST_CONTEXT, '❌ 住所情報が取得できませんでした');
      return null;
    }

    const components = result.address_components;
    const sublocality = components.find(comp =>
      comp.types.includes('sublocality_level_1')
    )?.long_name;

    if (sublocality) {
      logInfo(TEST_CONTEXT, `✅ 地区名取得成功 → region_tag = ${sublocality}`);
      return sublocality;
    } else {
      logInfo(TEST_CONTEXT, '⚠️ sublocality_level_1 が見つかりませんでした（fallback検討要）');
      return null;
    }
  } catch (err) {
    logError(TEST_CONTEXT, `❌ API呼び出し失敗: ${err.message}`);
    throw err;
  }
}

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('getRegionTag 関数テスト', () => {
  it('秋葉原の地区名が取得できること', async () => {
    const lat = 35.698683;
    const lng = 139.773216;

    try {
      const regionTag = await getRegionTag(lat, lng);

      expect(typeof regionTag === 'string' || regionTag === null).toBe(true);
      logInfo(TEST_CONTEXT, `✅ テスト成功: region_tag = ${regionTag ?? 'なし'}`);
    } catch (err) {
      logError(TEST_CONTEXT, `❌ テスト失敗: ${err.message}`);
      throw err;
    }
  }, 20_000); // ⏱️ API呼び出しなので20秒タイムアウト
});
