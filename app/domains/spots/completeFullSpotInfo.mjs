// app/domains/spots/completeFullSpotInfo.mjs

import config from '../../../config.mjs';
import { searchTextSpot } from './searchTextSpot.mjs';
import { enrichSpotDetails } from './enrichSpotDetails.mjs';
import { completeWithDeepSeek } from './completeWithDeepSeek.mjs';
import { writeSpot } from './writeSpot.mjs';
import { getPrimaryCategory, getCategoriesFromTypes } from './categorizeSpot.mjs';
import { getRegionTagByLatLng } from './getRegionTagByLatLng.mjs';
import { updateSpotStatus } from './updateSpotStatus.mjs';
import { updateKeywordStatus } from '../keywords/updateKeywordStatus.mjs';
import { getStoredPlaceIds } from '../../utils/getStoredPlaceIds.mjs';
import { logInfo, logError, logWarn } from '../../utils/logger.mjs';

const CONTEXT = 'completeFullSpotInfo';

/**
 * スポット補完フロー（Google + DeepSeek + カテゴリ分類 + 地域タグ）
 * @param {string} keyword - 検索キーワード（例: "Akihabara Animate"）
 */
export async function completeFullSpotInfo(keyword) {
  logInfo(CONTEXT, `🔍 keyword="${keyword}" → Google + DeepSeek 補完を開始`);

  let placeIdForLog = null;

  try {
    const storedPlaceIds = await getStoredPlaceIds();
    const spotFromSearch = await searchTextSpot(keyword);

    if (!spotFromSearch || !spotFromSearch.placeId) {
      logWarn(CONTEXT, `⚠️ placeId を取得できず → failed に設定: "${keyword}"`);
      await updateKeywordStatus(keyword, 'failed');
      return { success: false, reason: 'placeId not found' }; // ← 明示的に
    }

    placeIdForLog = spotFromSearch.placeId;

    if (storedPlaceIds.includes(placeIdForLog)) {
      logWarn(CONTEXT, `⚠️ すでに登録済みのplaceId → 処理をスキップ: ${placeIdForLog}`);
      await updateKeywordStatus(keyword, 'skipped');
      return { success: false, reason: 'already exists', placeId: placeIdForLog };
    }

    const enrichedSpot = await enrichSpotDetails(spotFromSearch);
    const deepSeekResult = await completeWithDeepSeek(enrichedSpot);

    if (!deepSeekResult.description) {
      logWarn(CONTEXT, `⚠️ DeepSeek description が空（placeId=${placeIdForLog}）→ 再補完対象外`);
    }

    const category = getPrimaryCategory(enrichedSpot.types);
    const tags = getCategoriesFromTypes(enrichedSpot.types);
    logInfo(CONTEXT, `📦 カテゴリ分類: category="${category}" / tags=${JSON.stringify(tags)}`);

    const region_tag = await getRegionTagByLatLng(enrichedSpot.lat, enrichedSpot.lng);

    const fullyCompletedSpot = {
      ...enrichedSpot,
      description: typeof deepSeekResult.description === 'string' ? deepSeekResult.description : '',
      short_tip_en: typeof deepSeekResult.short_tip_en === 'string' ? deepSeekResult.short_tip_en : '',
      best_time: '', // 初期化のみ（DeepSeekでは扱わない）
      ai_description_status: typeof deepSeekResult.ai_description_status === 'string' ? deepSeekResult.ai_description_status : 'unknown',
      category_for_map: category,
      tags_json: JSON.stringify(tags),
      source_type: 'api',
      region_tag,
    };
    
    logInfo(CONTEXT, `🧠 DeepSeek補完: description=${!!deepSeekResult.description}, tip=${!!deepSeekResult.short_tip_en}, ai_description_status="${deepSeekResult.ai_description_status}"`);

    await writeSpot(fullyCompletedSpot);
    await updateSpotStatus(fullyCompletedSpot.placeId, 'done');
    await updateKeywordStatus(keyword, 'done');

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
    return { success: true, placeId: fullyCompletedSpot.placeId };
  } catch (err) {
    logError(CONTEXT, `❌ 補完処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);

    if (placeIdForLog) {
      await updateSpotStatus(placeIdForLog, 'error');
    }
    await updateKeywordStatus(keyword, 'error');
    return { success: false, reason: err.message }
  }
}
