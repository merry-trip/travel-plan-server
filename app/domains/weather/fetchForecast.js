// app/domains/weather/fetchForecast.js

const axios = require('axios');
require('dotenv').config();
const { logInfo, logError } = require('../../utils/logger'); // ✅ 修正済み

const context = 'domains/weather/fetchForecast';
const appEnv = process.env.APP_ENV || 'dev';

logInfo(context, `現在の環境: ${appEnv}`);

const apiKey = appEnv === 'prod'
  ? process.env.OPENWEATHER_API_KEY_PROD
  : process.env.OPENWEATHER_API_KEY_DEV;

async function getForecastByCoords(lat, lon, units = 'metric', lang = 'en') {
  const url = `https://api.openweathermap.org/data/2.5/forecast`;
  logInfo(context, `天気APIにリクエスト送信中: lat=${lat}, lon=${lon}, units=${units}, lang=${lang}`);

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units,
        lang,
      }
    });

    logInfo(context, `✅ 天気データ取得成功（件数: ${response.data.list.length}）`);
    return response.data;

  } catch (error) {
    logError(context, `❌ 天気APIエラー: ${error.message}`);
    throw error;
  }
}

module.exports = { getForecastByCoords };
