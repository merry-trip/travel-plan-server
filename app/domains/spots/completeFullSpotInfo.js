// app/domains/spots/completeFullSpotInfo.js

const { searchTextSpot } = require('./searchTextSpot.js');
const { enrichSpotDetails } = require('./enrichSpotDetails.js');
const { completeWithDeepSeek } = require('./completeWithDeepSeek.js');
const { writeSpot } = require('./writeSpot.js');
const { logInfo, logError } = require('../../utils/logger.js');

const CONTEXT = 'completeFullSpotInfo';

/**
 * スポット補完フロー（Google + DeepSeek）
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

    // Step 4: 統合データの生成（DeepSeekの description を強制優先）
    const fullyCompletedSpot = {
      ...enrichedSpot,

      // ✅ DeepSeekの出力で必ず上書きする（objectやtext混入を防ぐ）
      description:
        typeof deepSeekResult.description === 'string'
          ? deepSeekResult.description
          : '',

      short_tip_en:
        typeof deepSeekResult.tip === 'string'
          ? deepSeekResult.tip
          : ''
    };

    // ✅ ログで中身確認
    logInfo(CONTEXT, `🧪 description = ${JSON.stringify(fullyCompletedSpot.description)}`);

    // Step 5: スプレッドシートに保存（placeId が存在すれば上書き）
    await writeSpot(fullyCompletedSpot);

    logInfo(CONTEXT, `✅ 完了: keyword="${keyword}" → placeId=${fullyCompletedSpot.placeId}`);
  } catch (err) {
    logError(CONTEXT, `❌ 処理失敗: keyword="${keyword}"`);
    logError(CONTEXT, err);
  }
}

module.exports = { completeFullSpotInfo };
