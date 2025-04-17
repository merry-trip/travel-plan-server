// app/domains/spots/columnOrder.js

/**
 * スプレッドシートへの出力列順を定義
 * 必須：writeSpot.js / mapSpotToRow() などで使用
 * 補足：列の追加・削除時は必ずこの配列を更新すること！
 */
module.exports = [
  // ① 基本情報
  'placeId',
  'name',
  'lat',
  'lng',
  'formatted_address',
  'types',
  'source_type',
  'category_for_map',
  'display_name',
  'region_tag',

  // ② 詳細情報（GetPlaceDetails）
  'website_url',
  'rating',
  'ratings_count',
  'business_status',
  'open_now',
  'opening_hours',

  // ③ DeepSeek + カスタム列
  'description',
  'short_tip_en',
  'best_time',
  'photo_ok',
  'english_menu',
  'cash_only',
  'crowd_level',              // ✅ 追加！
  'ai_description_status',    // ✅ 追加！
  'short_review_summary',
  'tags',
  'tags_json',

  // ④ 周辺・移動・利便性
  'nearest_station',
  'walking_time_from_station',
  'related_spots',
  'has_foreign_currency_atm',
  'has_free_wifi',
  'rental_cycle_nearby',

  // ⑤ UX・人気分析
  'search_count',
  'search_popularity',
  'visit_feedback_score',
  'user_tags',
  'verified',
  'note',
  'status',
  'last_updated_at',
];
