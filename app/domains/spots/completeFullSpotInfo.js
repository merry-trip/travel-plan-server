// app/domains/spots/completeFullSpotInfo.js

const config = require('../../config'); // ✅ config追加（将来の拡張に備える）

const { searchTextSpot } = require('./searchTextSpot.js');
const { enrichSpotDetails } = require('./enrichSpotDetails.js');
const { completeWithDeepSeek } = require('./completeWithDeepSeek.js');
const { writeSpot } = require('./writeSpot.js');
const { getPrimaryCategory, getCategoriesFromTypes } = require('./categorizeSpot.js');
const { getRegionTagByLatLng } = require('./getRegionTagByLatLng.js');
const { updateSpotStatus } = require('./updateSpotStatus.js');
const { updateKeywordStatus } = require('../keywords/updateKeywordStatus.js');
const { logInfo, logError, logWarn } = require('../../utils/logger.js'); // ✅ logWarn追加

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
    if (!deepSeekResult.description) {
      logWarn(CONTEXT, `⚠️ DeepSeek description が空（placeId=${placeIdForLog}）`);
    }

    // Step 4: カテゴリ
    const category = getPrimaryCategory(enrichedSpot.types);
    if (!category || category === 'other') {
      logWarn(CONTEXT, `⚠️ 未分類カテゴリ: types=${JSON.stringify(enrichedSpot.types)} → category="${category}"`);
    }

    const tags = getCategoriesFromTypes(enrichedSpot.types);
    logInfo(CONTEXT, `📦 カテゴリ分類: category="${category}" / tags=${JSON.stringify(tags)}`);

    // Step 5: 地域タグ
    const regionTag = getRegionTagByLatLng(enrichedSpot.lat, enrichedSpot.lng);
    if (!regionTag) {
      logWarn(CONTEXT, `⚠️ 地域タグが空（lat=${enrichedSpot.lat}, lng=${enrichedSpot.lng}）`);
    }

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
    await updateKeywordStatus(keyword, 'done');

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
  } catch (err) {
    logError(CONTEXT, `❌ 処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);

    if (placeIdForLog) {
      await updateSpotStatus(placeIdForLog, 'failed');
    }

    await updateKeywordStatus(keyword, 'error');
  }
}

module.exports = { completeFullSpotInfo };
