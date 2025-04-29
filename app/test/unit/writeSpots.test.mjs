// app/test/unit/writeSpots.test.mjs

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import writeSpots from '../../domains/spots/writeSpots.mjs';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '../../config.mjs';

const TEST_CONTEXT = 'writeSpots.test.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

// ✅ テスト用スポットデータ（サンプル1件）
const enrichedSpot = {
  placeId: 'ChIJU9ZPE2-NGGARwiJyx0Id61E',
  name: 'Sunshine City',
  lat: 35.7289709,
  lng: 139.7195415,
  formatted_address: '3-chōme-1-1 Higashiikebukuro, Toshima City, Tokyo 170-8630, Japan',
  website_url: 'https://sunshinecity.jp/',
  rating: 4.1,
  ratings_count: 30716,
  business_status: 'OPERATIONAL',
  open_now: true,
  opening_hours: 'Monday: 10:00 AM – 8:00 PM, Tuesday: 10:00 AM – 8:00 PM',
  primary_type: 'Shopping Mall',
  display_name: 'Sunshine City',
  price_level: null,
  phone: '+81 3-3989-3331',
  summary: 'Multibuilding mall with shops, eateries, an observation deck, aquarium, museum & indoor theme parks.',
  types: ['shopping_mall', 'aquarium'],
  source_type: 'api',
  category_for_map: 'anime',
  region_tag: 'ikebukuro',
  description: '',
  short_tip_en: '',
  best_time: '',
  photo_ok: '',
  english_menu: '',
  cash_only: '',
  short_review_summary: '',
  tags: '',
  tags_json: '',
  nearest_station: '',
  walking_time_from_station: '',
  related_spots: '',
  has_foreign_currency_atm: '',
  has_free_wifi: '',
  rental_cycle_nearby: '',
  search_count: '',
  search_popularity: '',
  visit_feedback_score: '',
  user_tags: '',
  verified: '',
  note: '',
  last_updated_at: new Date().toISOString(),
  status: 'done'
};

beforeAll(() => {
  logInfo(TEST_CONTEXT, `✅ テスト開始 (env=${config.env})`);
});

afterAll(() => {
  logInfo(TEST_CONTEXT, '✅ テスト終了');
});

describe('writeSpots() - 複数スポット書き込みテスト', () => {
  test('✅ enrichedSpotを例外なく書き込める', async () => {
    try {
      const result = await writeSpots([enrichedSpot]);

      logInfo(TEST_CONTEXT, '✅ writeSpots 成功（1件書き込み）');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    } catch (err) {
      logError(TEST_CONTEXT, `❌ writeSpots テスト失敗: ${err.message}`);
      throw err; // テスト失敗扱い
    }
  }, 20_000); // ⏱️ スプレッドシート操作に20秒タイムアウト
});
