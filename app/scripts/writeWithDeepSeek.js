// app/scripts/writeWithDeepSeek.js

const { getKeywordsFromSheet } = require('../domains/spots/getKeywordsFromSheet.js');
const { completeWithDeepSeek } = require('../domains/spots/completeWithDeepSeek.js');
const { updateSpotDetails } = require('../domains/spots/updateSpotDetails.js');
const { logInfo, logError } = require('../utils/logger.js');
const config = require('../config'); // ✅ 今後の統一運用に備えて導入

const CONTEXT = 'writeWithDeepSeek';

async function main() {
  logInfo(CONTEXT, '🔄 DeepSeek補完バッチ処理を開始します');

  let keywords = [];
  try {
    keywords = await getKeywordsFromSheet();
    logInfo(CONTEXT, `✅ 抽出対象キーワード数: ${keywords.length}`);
  } catch (err) {
    logError(CONTEXT, '❌ キーワード取得に失敗');
    logError(CONTEXT, err);
    return;
  }

  for (const keywordRow of keywords) {
    const { rowIndex, keyword } = keywordRow;
    logInfo(CONTEXT, `🎯 処理開始: row=${rowIndex}, keyword="${keyword}"`);

    try {
      const result = await completeWithDeepSeek({ name: keyword });

      const { description, short_tip_en } = result;

      if (!description || !short_tip_en) {
        logError(CONTEXT, `⚠️ 補完結果が空です: keyword="${keyword}"`);
        await updateSpotDetails({
          name: keyword,
          placeId: 'PLACE_ID_XXXX', // ←仮IDでOK（後で統合）
          description: '',
          short_tip_en: '',
          ai_description_status: 'failed'
        });
        continue;
      }

      await updateSpotDetails({
        name: keyword,
        placeId: 'PLACE_ID_XXXX',
        description,
        short_tip_en,
        ai_description_status: 'done'
      });

      logInfo(CONTEXT, `✅ 補完・保存完了: keyword="${keyword}"`);
    } catch (err) {
      logError(CONTEXT, `❌ 処理失敗: keyword="${keyword}"`);
      logError(CONTEXT, err);
      await updateSpotDetails({
        name: keyword,
        placeId: 'PLACE_ID_XXXX',
        description: '',
        short_tip_en: '',
        ai_description_status: 'failed'
      });
    }
  }

  logInfo(CONTEXT, '🏁 DeepSeek補完バッチ処理を終了しました');
}

main();
