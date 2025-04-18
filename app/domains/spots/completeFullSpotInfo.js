// app/domains/spots/completeFullSpotInfo.js

const config = require('../../config');
const { searchTextSpot } = require('./searchTextSpot.js');
const { enrichSpotDetails } = require('./enrichSpotDetails.js');
const { completeWithDeepSeek } = require('./completeWithDeepSeek.js');
const { writeSpot } = require('./writeSpot.js');
const { getPrimaryCategory, getCategoriesFromTypes } = require('./categorizeSpot.js');
const { getRegionTagByLatLng } = require('./getRegionTagByLatLng.js');
const { updateSpotStatus } = require('./updateSpotStatus.js');
const { updateKeywordStatus } = require('../keywords/updateKeywordStatus.js');
const { getStoredPlaceIds } = require('../../utils/getStoredPlaceIds');
const { logInfo, logError, logWarn } = require('../../utils/logger.js');

const CONTEXT = 'completeFullSpotInfo';

/**
 * スポット補完フロー（Google + DeepSeek + カテゴリ分類 + 地域タグ）
 * @param {string} keyword - 検索キーワード（例: "Akihabara Animate"）
 */
async function completeFullSpotInfo(keyword) {
  logInfo(CONTEXT, `🔍 keyword="${keyword}" → Google + DeepSeek 補完を開始`);

  let placeIdForLog = null;

  try {
    // Step 0: 既存placeId一覧を取得（重複排除のため）
    const storedPlaceIds = await getStoredPlaceIds();

    // Step 1: placeId を取得
    const spotFromSearch = await searchTextSpot(keyword);

    if (!spotFromSearch || !spotFromSearch.placeId) {
      logWarn(CONTEXT, `⚠️ placeId を取得できず → failed に設定: "${keyword}"`);
      await updateKeywordStatus(keyword, 'failed');
      return;
    }

    placeIdForLog = spotFromSearch.placeId;

    // ✅ 重複 placeId の除外チェック
    if (storedPlaceIds.includes(spotFromSearch.placeId)) {
      logWarn(CONTEXT, `⚠️ すでに登録済みのplaceId → 処理をスキップ: ${placeIdForLog}`);
      await updateKeywordStatus(keyword, 'skipped');
      return;
    }

    // Step 2: 詳細取得
    const enrichedSpot = await enrichSpotDetails(spotFromSearch);

    // Step 3: DeepSeek 補完
    const deepSeekResult = await completeWithDeepSeek(enrichedSpot);
    if (!deepSeekResult.description) {
      logWarn(CONTEXT, `⚠️ DeepSeek description が空（placeId=${placeIdForLog}）→ 再補完対象外`);
    }

    // Step 4: カテゴリ分類
    const category = getPrimaryCategory(enrichedSpot.types);
    const tags = getCategoriesFromTypes(enrichedSpot.types);
    logInfo(CONTEXT, `📦 カテゴリ分類: category="${category}" / tags=${JSON.stringify(tags)}`);

    // Step 5: 地域タグ
    const regionTag = getRegionTagByLatLng(enrichedSpot.lat, enrichedSpot.lng);

    // Step 6: 統合データ作成
    const fullyCompletedSpot = {
      ...enrichedSpot,
      description: typeof deepSeekResult.description === 'string' ? deepSeekResult.description : '',
      short_tip_en: typeof deepSeekResult.short_tip_en === 'string' ? deepSeekResult.short_tip_en : '',
      category_for_map: category,
      tags_json: JSON.stringify(tags),
      source_type: 'api',
      region_tag: regionTag,
    };

    // Step 7: スプレッドシート保存
    await writeSpot(fullyCompletedSpot);

    // Step 8a: ステータス更新
    await updateSpotStatus(fullyCompletedSpot.placeId, 'done');
    await updateKeywordStatus(keyword, 'done');

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
  } catch (err) {
    logError(CONTEXT, `❌ 補完処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);

    // Step 8b: ステータス更新（失敗ログに placeId がある場合のみ更新）
    if (placeIdForLog) {
      await updateSpotStatus(placeIdForLog, 'error');
    }

    await updateKeywordStatus(keyword, 'error');
  }
}

module.exports = { completeFullSpotInfo };
