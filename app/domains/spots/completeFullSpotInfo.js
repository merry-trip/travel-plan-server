// app/domains/spots/completeFullSpotInfo.js

const { searchTextSpot } = require('./searchTextSpot.js');
const { enrichSpotDetails } = require('./enrichSpotDetails.js');
const { completeWithDeepSeek } = require('./completeWithDeepSeek.js');
const { writeSpot } = require('./writeSpot.js');
const { getPrimaryCategory, getCategoriesFromTypes } = require('./categorizeSpot.js');
const { getRegionTagByLatLng } = require('./getRegionTagByLatLng.js'); // ← region_tag 自動判定を追加
const { logInfo, logError } = require('../../utils/logger.js');

const CONTEXT = 'completeFullSpotInfo';

/**
 * スポット補完フロー（Google + DeepSeek + カテゴリ分類 + 地域タグ）
 * @param {string} keyword - シートから取得した検索キーワード（例: "Akihabara Animate"）
 */
async function completeFullSpotInfo(keyword) {
  logInfo(CONTEXT, `🔍 keyword="${keyword}" → Google + DeepSeek 補完を開始`);

  try {
    // Step 1: SearchText API で placeId を取得
    const spotFromSearch = await searchTextSpot(keyword);
    if (!spotFromSearch || !spotFromSearch.placeId) {
      throw new Error('❌ placeId が取得できませんでした');
    }

    // Step 2: Places API で詳細情報を補完
    const enrichedSpot = await enrichSpotDetails(spotFromSearch);

    // Step 3: DeepSeek で description / tip を補完
    const deepSeekResult = await completeWithDeepSeek(enrichedSpot);

    // Step 4: カテゴリ分類（Google types[] から）
    const category = getPrimaryCategory(enrichedSpot.types);
    const tags = getCategoriesFromTypes(enrichedSpot.types);

    // ✅ ログ出力（カテゴリ確認）
    logInfo(CONTEXT, `📦 カテゴリ分類: category="${category}" / tags=${JSON.stringify(tags)}`);

    // Step 5: 地域タグを緯度経度から判定
    const regionTag = getRegionTagByLatLng(enrichedSpot.lat, enrichedSpot.lng);

    // Step 6: 統合データの生成
    const fullyCompletedSpot = {
      ...enrichedSpot,
      description: typeof deepSeekResult.description === 'string' ? deepSeekResult.description : '',
      short_tip_en: typeof deepSeekResult.tip === 'string' ? deepSeekResult.tip : '',

      // ✅ 補足情報
      category_for_map: category,
      tags_json: JSON.stringify(tags),
      source_type: "api",
      region_tag: regionTag
    };

    // Step 7: スプレッドシートに保存
    await writeSpot(fullyCompletedSpot);

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
  } catch (err) {
    logError(CONTEXT, `❌ 処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);
  }
}

module.exports = { completeFullSpotInfo };
