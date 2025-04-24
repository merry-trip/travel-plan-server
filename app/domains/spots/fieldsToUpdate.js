// app/domains/spots/fieldsToUpdate.js

/**
 * ratingバッチ処理などで更新対象とするフィールド
 */
module.exports = [
    'rating',
    'ratings_count',
    'open_now',
    // 'opening_hours', ← 取得対象に含めるならコメントアウト解除
  ];
  