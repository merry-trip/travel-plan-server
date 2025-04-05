// app/test-write-to-sheet.js

require('dotenv').config();
const { logInfo, logError } = require('./utils/logger'); // ✅ logger導入！

const { getForecastByCoords } = require('./api/forecast');
const {
  appendWeatherRows,
  getExistingTimestampsWithRowNumbers,
  deleteRows,
  deleteOldRowsBeforeToday
} = require('./api/sheets');

const { sendMail } = require('./api/send-mail');

const appEnv = process.env.APP_ENV || 'dev';

async function main() {
  const context = 'test-write-to-sheet';

  try {
    // ✅ 古いデータを削除
    logInfo(context, '🧹 古い天気データの削除を開始');
    await deleteOldRowsBeforeToday();

    logInfo(context, `🌤️ 天気情報を取得中...（環境: ${appEnv}）`);
    const forecast = await getForecastByCoords(35.6895, 139.6917, 'metric', 'en');

    const rows = forecast.list.map(entry => [
      entry.dt_txt,
      'Tokyo',
      entry.main.temp,
      entry.weather[0].description,
      entry.main.humidity,
      entry.wind.speed,
      entry.main.pressure
    ]);

    // ✅ 重複チェック＆削除
    const existingMap = await getExistingTimestampsWithRowNumbers();
    const overlappingRows = rows.map(row => existingMap[row[0]]).filter(Boolean);
    if (overlappingRows.length > 0) {
      logInfo(context, `⚠️ 重複行 ${overlappingRows.length} 件を削除します`);
      await deleteRows(overlappingRows);
    }

    logInfo(context, `📝 スプレッドシートに ${rows.length} 行を書き込みます...`);
    await appendWeatherRows(rows);

    // ✅ 成功通知メール
    await sendMail({
      subject: '✅ 天気ログ完了',
      text: `スプレッドシートに ${rows.length} 件の天気データを記録しました。\n環境: ${appEnv}`
    });
    logInfo(context, '📧 通知メールを送信しました（成功）');

  } catch (err) {
    logError(context, `❌ 書き込みエラー: ${err.message}`);
    logError(context, err.stack);

    // ✅ エラー通知メール
    await sendMail({
      subject: '❌ 天気ログ失敗',
      text: `エラーが発生しました：${err.message}`
    });
    logInfo(context, '📧 エラー通知メールを送信しました（失敗）');
  }
}

main();
