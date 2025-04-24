// test-scripts/writeSpots.test.mjs

import writeSpots from '../app/domains/spots/writeSpots.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const context = 'test-writeSpots';

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

try {
  logInfo(context, `🧪 writeSpots テスト開始（env=${config.env}）`);
  await writeSpots([enrichedSpot]);
  logInfo(context, `✅ writeSpots テスト成功（1件書き込み）`);
} catch (err) {
  logError(context, `❌ writeSpots テスト失敗: ${err.message}`);
}
