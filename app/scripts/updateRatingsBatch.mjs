// app/scripts/updateRatingsBatch.mjs

import config from '@/config.mjs';
import { logInfo, logDebug, logWarn, logError } from '../utils/logger.mjs'; // ✅ 正しいimport
import { getSheetClient } from '../utils/auth.mjs';

import getBasicPlaceDetails from '../domains/spots/getBasicPlaceDetails.mjs';
import updateSpotRow from '../domains/spots/updateSpotRow.mjs';
import fieldsToUpdate from '../domains/spots/fieldsToUpdate.mjs';

const context = 'updateRatingsBatch';

logInfo(context, 'バッチ処理を開始します');

try {
  const client = await getSheetClient();
  console.log('[DEBUG] 読み込んだシート一覧:', Object.keys(client.sheetsByTitle));

  const sheet = client.sheetsByTitle[config.SHEET_NAME_SPOT];
  const rows = await sheet.getRows();

  let successCount = 0;
  let failCount = 0;

  for (const row of rows) {
    const placeId = row.place_id;
    if (!placeId) continue;

    logInfo(context, `🔄 処理開始: ${placeId}`);

    try {
      const apiResult = await getBasicPlaceDetails(placeId);
      logDebug(context, `📦 APIレスポンス: ${JSON.stringify(apiResult)}`);

      const updates = {};
      for (const key of fieldsToUpdate) {
        if (apiResult[key] !== undefined) {
          updates[key] = apiResult[key];
        }
      }

      logDebug(context, `🧾 更新対象: ${JSON.stringify(updates)}`);

      if (Object.keys(updates).length === 0) {
        logInfo(context, `⏭ 更新不要（取得結果なし）: ${placeId}`);
        continue;
      }

      const result = await updateSpotRow(placeId, updates);

      if (result) {
        logInfo(context, `✅ 更新成功: ${placeId}`);
        successCount++;
      } else {
        logWarn(context, `⚠️ 行が見つかりませんでした: ${placeId}`);
        failCount++;
      }
    } catch (err) {
      logError(context, `❌ 更新失敗: ${placeId} - ${err.message}`);
      failCount++;
    }
  }

  logInfo(context, `📊 更新完了: 成功=${successCount}, 失敗=${failCount}`);
} catch (err) {
  logError(context, `💥 全体エラー: ${err.message}`);
  process.exit(1);
}

logInfo(context, 'バッチ処理を終了します');
