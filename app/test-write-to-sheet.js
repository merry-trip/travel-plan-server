const { getForecastByCoords } = require('./api/forecast');
const {
  appendWeatherRows,
  getExistingTimestampsWithRowNumbers,
  deleteRows,
  deleteOldRowsBeforeToday  // ✅ ←追加！
} = require('./api/sheets');
const { sendMail } = require('./api/send-mail'); // ✅ 通知用関数

require('dotenv').config();

const appEnv = process.env.APP_ENV || 'dev';

async function main() {
  try {
    const lat = 35.6895;
    const lon = 139.6917;
    const lang = 'en';
    const units = 'metric';

    // ✅ 今日より前のデータを削除！
    await deleteOldRowsBeforeToday();

    console.log(`🌤️ 天気情報を取得中...（環境: ${appEnv}）`);
    const forecast = await getForecastByCoords(lat, lon, units, lang);

    const rows = forecast.list.map(entry => {
      return [
        entry.dt_txt,
        'Tokyo',
        entry.main.temp,
        entry.weather[0].description,
        entry.main.humidity,
        entry.wind.speed,
        entry.main.pressure
      ];
    });

    // ✅ 重複行の削除処理（上書き対策）
    const existingMap = await getExistingTimestampsWithRowNumbers();
    const overlappingRows = rows.map(row => existingMap[row[0]]).filter(Boolean);
    await deleteRows(overlappingRows);

    console.log(`📝 スプレッドシートに ${rows.length} 行を書き込みます...`);
    await appendWeatherRows(rows);

    // ✅ 通知メール（成功時）
    await sendMail({
      subject: '✅ 天気ログ完了',
      text: `スプレッドシートに ${rows.length} 件の天気データを記録しました。\n環境: ${appEnv}`
    });
    console.log('📧 通知メールを送信しました！');

  } catch (err) {
    console.error('❌ 書き込みエラー:', err.message);

    // ✅ 通知メール（エラー時）
    await sendMail({
      subject: '❌ 天気ログ失敗',
      text: `エラーが発生しました：${err.message}`
    });

    console.log('📧 エラー通知メールを送信しました');
  }
}

main();
