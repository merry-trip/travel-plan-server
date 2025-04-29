// app/domains/spots/completeSpotInfo.mjs

import { logInfo, logError } from '../../utils/logger.mjs';
import searchTextSpot from './searchTextSpot.mjs';
import enrichSpotDetails from './enrichSpotDetails.mjs';
import writeSpot from './writeSpot.mjs';

/**
 * 1スポットの情報を検索・補完・スプレッドシート書き込みまで行う簡易処理
 * @param {string} inputText - 検索用の入力文字列（例: "秋葉原 アニメイト"）
 * @returns {Promise<{ success: boolean, placeId?: string, error?: string }>}
 */
export default async function completeSpotInfo(inputText) {
  try {
    logInfo('completeSpotInfo', `🔍 Start completeSpotInfo for "${inputText}"`);

    // Step 1: placeId を取得（SearchText API）
    const placeId = await searchTextSpot(inputText);
    if (!placeId) throw new Error('placeId not found');

    // Step 2: 詳細補完（PlaceDetails API）
    const spotData = await enrichSpotDetails(placeId);

    // Step 3: スプレッドシートに書き込み
    await writeSpot(spotData);

    logInfo('completeSpotInfo', `✅ Spot info completed: ${placeId}`);
    return { success: true, placeId };

  } catch (err) {
    logError('completeSpotInfo', `❌ Failed to complete spot info: ${err.message}`);
    return { success: false, error: err.message };
  }
}
