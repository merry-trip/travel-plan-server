const { getConfig } = require('../config');
const logger = require('../utils/logger');
const getBasicPlaceDetails = require('../domains/spots/getBasicPlaceDetails');
const updateSpotRow = require('../domains/spots/updateSpotRow');
const fieldsToUpdate = require('../domains/spots/fieldsToUpdate');
const { getSheetClient } = require('../utils/auth');

const context = 'updateRatingsBatch';

(async () => {
  logger.logInfo(context, 'バッチ処理を開始します');

  try {
    const config = getConfig();
    const client = await getSheetClient();
    console.log('[DEBUG] 読み込んだシート一覧:', Object.keys(client.sheetsByTitle));
    const sheet = client.sheetsByTitle[config.SHEET_NAME_SPOT];
    const rows = await sheet.getRows();

    let successCount = 0;
    let failCount = 0;

    for (const row of rows) {
      const placeId = row.place_id;
      if (!placeId) continue;

      logger.logInfo(context, `🔄 処理開始: ${placeId}`);

      try {
        const apiResult = await getBasicPlaceDetails(placeId);
        logger.logDebug(context, `📦 APIレスポンス: ${JSON.stringify(apiResult)}`);

        const updates = {};
        for (const key of fieldsToUpdate) {
          if (apiResult[key] !== undefined) {
            updates[key] = apiResult[key];
          }
        }

        logger.logDebug(context, `🧾 更新対象: ${JSON.stringify(updates)}`);

        if (Object.keys(updates).length === 0) {
          logger.logInfo(context, `⏭ 更新不要（取得結果なし）: ${placeId}`);
          continue;
        }

        const result = await updateSpotRow(placeId, updates);

        if (result) {
          logger.logInfo(context, `✅ 更新成功: ${placeId}`);
          successCount++;
        } else {
          logger.logWarn(context, `⚠️ 行が見つかりませんでした: ${placeId}`);
          failCount++;
        }
      } catch (err) {
        logger.logError(context, `❌ 更新失敗: ${placeId} - ${err.message}`);
        failCount++;
      }
    }

    logger.logInfo(context, `📊 更新完了: 成功=${successCount}, 失敗=${failCount}`);
  } catch (err) {
    logger.logError(context, `💥 全体エラー: ${err.message}`);
    process.exit(1);
  }

  logger.logInfo(context, 'バッチ処理を終了します');
})();
