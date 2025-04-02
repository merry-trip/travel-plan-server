const { getForecastByCoords } = require('./api/forecast');
const {
  appendWeatherRows,
  getExistingTimestampsWithRowNumbers,
  deleteRows
} = require('./api/sheets');

require('dotenv').config();

const appEnv = process.env.APP_ENV || 'dev';

async function main() {
  try {
    const lat = 35.6895;
    const lon = 139.6917;
    const lang = 'en';
    const units = 'metric';

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

  } catch (err) {
    console.error('❌ 書き込みエラー:', err.message);
  }
}

main();
