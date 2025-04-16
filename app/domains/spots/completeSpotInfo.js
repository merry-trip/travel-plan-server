// app/domains/spots/completeSpotInfo.js
const { logInfo, logError } = require('../../utils/logger');
const searchTextSpot = require('./searchTextSpot');
const enrichSpotDetails = require('./enrichSpotDetails');
const writeSpot = require('./writeSpot');

async function completeSpotInfo(inputText) {
  try {
    logInfo('🔍 Start completeSpotInfo', { inputText });

    // Step 1: placeId を取得
    const placeId = await searchTextSpot(inputText);
    if (!placeId) throw new Error('placeId not found');

    // Step 2: 詳細補完
    const spotData = await enrichSpotDetails(placeId);

    // Step 3: スプレッドシートに書き込み
    await writeSpot(spotData);

    logInfo('✅ Spot info completed and written to sheet.', { placeId });
    return { success: true, placeId };

  } catch (err) {
    logError('❌ Failed to complete spot info.', { error: err.message });
    return { success: false, error: err.message };
  }
}

module.exports = completeSpotInfo;
