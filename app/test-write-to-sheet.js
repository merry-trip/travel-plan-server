// test-write-to-sheet.js
const { getForecastByCoords } = require('./api/forecast');
const { appendWeatherRows } = require('./api/sheets');
require('dotenv').config();

// 環境（dev / prod）を取得
const appEnv = process.env.APP_ENV || 'dev';

async function main() {
  try {
    const lat = 35.6895; // 東京
    const lon = 139.6917;
    const lang = 'en';
    const units = 'metric';

    console.log(`🌤️ 天気情報を取得中...（環境: ${appEnv}）`);
    const forecast = await getForecastByCoords(lat, lon, units, lang);

    const rows = forecast.list.map(entry => {
      return [
        entry.dt_txt,                  // 日時（例：2025-04-01 12:00:00）
        'Tokyo',                       // 都市名（今は固定）
        entry.main.temp,
        entry.weather[0].description,
        entry.main.humidity,
        entry.wind.speed,
        entry.main.pressure
      ];
    });

    console.log(`📝 スプレッドシートに ${rows.length} 行を書き込みます...`);
    await appendWeatherRows(rows);
  } catch (err) {
    console.error('❌ 書き込みエラー:', err.message);
  }
}

main();
