// app/domains/spots/columnOrder.js
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
  
    // ③ DeepSeek自動生成
    'description',
    'short_tip_en',
    'best_time',
    'photo_ok',
    'english_menu',
    'cash_only',
  
    // ④ レビュー加工
    'short_review_summary',
    'tags',
    'tags_json',
  
    // ⑤ 周辺・移動・利便性
    'nearest_station',
    'walking_time_from_station',
    'related_spots',
    'has_foreign_currency_atm',
    'has_free_wifi',
    'rental_cycle_nearby',
  
    // ⑥ UX・人気分析
    'search_count',
    'search_popularity',
    'visit_feedback_score',
    'user_tags',
    'verified',
    'note',
    'last_updated_at',
  ];
  