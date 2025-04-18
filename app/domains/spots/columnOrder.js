/**
 * スプレッドシートへの出力列順を定義
 * 必須：writeSpot.js / mapSpotToRow() などで使用
 * 補足：列の追加・削除時は必ずこの配列を更新すること！
 */

module.exports = [
  // ① 基本情報（Spot識別・マッピング）
  'placeId',
  'name',
  'display_name',
  'formatted_address',
  'lat',
  'lng',
  'types',
  'category_for_map',
  'region_tag',

  // ② タグ系（複数軸分類）
  'tags',
  'tags_json',

  // ③ 詳細情報（GetPlaceDetails）
  'website_url',
  'business_status',
  'photo_ok',
  'english_menu',
  'cash_only',
  'open_now',
  'opening_hours',
  'crowd_level',
  'has_free_wifi',
  'has_foreign_currency_atm',
  'rental_cycle_nearby',

  // ④ 周辺・移動
  'nearest_station',
  'walking_time_from_station',

  // ⑤ DeepSeek + AI 生成
  'description',
  'short_tip_en',
  'short_review_summary',
  'ai_description_status',

  // ⑥ レビュー・評価（週次更新想定）
  'rating',
  'ratings_count',

  // ⑦ UX・人気分析
  'visit_feedback_score',
  'user_tags',
  'search_count',
  'search_popularity',

  // ⑧ 関連情報
  'related_spots',
  'source_type',
  'verified',
  'note',
  'status',
  'last_updated_at',

  // ⑨ カスタムTips（DeepSeekなどで将来拡張可能）
  'best_time',
];
