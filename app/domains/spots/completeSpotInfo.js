// app/domains/spots/completeSpotInfo.js

const { logInfo, logError } = require('../../utils/logger');
const searchTextSpot = require('./searchTextSpot');
const enrichSpotDetails = require('./enrichSpotDetails');
const writeSpot = require('./writeSpot');

/**
 * 1スポットの情報を検索・補完・スプレッドシート書き込みまで行う簡易処理
 * @param {string} inputText - 検索用の入力文字列（例: "秋葉原 アニメイト"）
 * @returns {Promise<{ success: boolean, placeId?: string, error?: string }>}
 */
async function completeSpotInfo(inputText) {
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

module.exports = completeSpotInfo;
