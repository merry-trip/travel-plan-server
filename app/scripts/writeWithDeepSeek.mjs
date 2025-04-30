// app/scripts/writeWithDeepSeek.mjs

import { getKeywordsFromSheet } from '../domains/spots/getKeywordsFromSheet.mjs';
import { completeWithDeepSeek } from '../domains/spots/completeWithDeepSeek.mjs';
import { updateSpotDetails } from '../domains/spots/updateSpotDetails.mjs';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '../../config.mjs';

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
          placeId: 'PLACE_ID_XXXX',
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

// APP_ENV=test 時には自動実行を防止
if (config.env !== 'test') {
  main();
}
