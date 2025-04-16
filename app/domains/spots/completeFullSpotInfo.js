// app/domains/spots/completeFullSpotInfo.js

const { searchTextSpot } = require('./searchTextSpot.js');
const { enrichSpotDetails } = require('./enrichSpotDetails.js');
const { completeWithDeepSeek } = require('./completeWithDeepSeek.js');
const { writeSpot } = require('./writeSpot.js');
const { getPrimaryCategory, getCategoriesFromTypes } = require('./categorizeSpot.js');
const { getRegionTagByLatLng } = require('./getRegionTagByLatLng.js');
const { updateSpotStatus } = require('./updateSpotStatus.js');
const { updateKeywordStatus } = require('../keywords/updateKeywordStatus.js'); // ✅ 追加
const { logInfo, logError } = require('../../utils/logger.js');

const CONTEXT = 'completeFullSpotInfo';

/**
 * スポット補完フロー（Google + DeepSeek + カテゴリ分類 + 地域タグ）
 * @param {string} keyword - シートから取得した検索キーワード（例: "Akihabara Animate"）
 */
async function completeFullSpotInfo(keyword) {
  logInfo(CONTEXT, `🔍 keyword="${keyword}" → Google + DeepSeek 補完を開始`);

  let placeIdForLog = null;

  try {
    // Step 1: placeId を取得
    const spotFromSearch = await searchTextSpot(keyword);
    if (!spotFromSearch || !spotFromSearch.placeId) {
      throw new Error('❌ placeId が取得できませんでした');
    }

    placeIdForLog = spotFromSearch.placeId;

    // Step 2: 詳細取得
    const enrichedSpot = await enrichSpotDetails(spotFromSearch);

    // Step 3: DeepSeek 補完
    const deepSeekResult = await completeWithDeepSeek(enrichedSpot);

    // Step 4: カテゴリ
    const category = getPrimaryCategory(enrichedSpot.types);
    const tags = getCategoriesFromTypes(enrichedSpot.types);
    logInfo(CONTEXT, `📦 カテゴリ分類: category="${category}" / tags=${JSON.stringify(tags)}`);

    // Step 5: 地域タグ
    const regionTag = getRegionTagByLatLng(enrichedSpot.lat, enrichedSpot.lng);

    // Step 6: 統合データ作成
    const fullyCompletedSpot = {
      ...enrichedSpot,
      description: typeof deepSeekResult.description === 'string' ? deepSeekResult.description : '',
      short_tip_en: typeof deepSeekResult.tip === 'string' ? deepSeekResult.tip : '',
      category_for_map: category,
      tags_json: JSON.stringify(tags),
      source_type: 'api',
      region_tag: regionTag,
    };

    // Step 7: スプレッドシート保存
    await writeSpot(fullyCompletedSpot);

    // ✅ Step 8a: ステータス更新（両方）
    await updateSpotStatus(fullyCompletedSpot.placeId, 'done');
    await updateKeywordStatus(keyword, 'done'); // ←✅ここ追加！

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
  } catch (err) {
    logError(CONTEXT, `❌ 処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);

    // ✅ Step 9a: Spot ステータス更新（失敗時）
    if (placeIdForLog) {
      await updateSpotStatus(placeIdForLog, 'failed');
    }

    // ✅ Step 9b: Keyword 側も error に更新
    await updateKeywordStatus(keyword, 'error');
  }
}

module.exports = { completeFullSpotInfo };
