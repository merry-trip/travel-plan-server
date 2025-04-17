// app/api/weather.js

const axios = require('axios');
const { logInfo, logError } = require('../utils/logger');
const config = require('../config');

const context = 'api/weather';

/**
 * OpenWeatherの現在の天気情報を取得する
 * @param {number} lat - 緯度
 * @param {number} lon - 経度
 * @param {string} units - 単位（'metric' または 'imperial'）
 * @param {string} lang - 言語コード（例: 'ja', 'en'）
 * @returns {Promise<Object>}
 */
async function getWeatherByCoords(lat, lon, units = 'metric', lang = 'en') {
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    logInfo(context, `🌤️ 天気取得リクエスト: lat=${lat}, lon=${lon}, units=${units}, lang=${lang}`);

    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: config.OPENWEATHER_API_KEY,
        units,
        lang,
      }
    });

    logInfo(context, `✅ 天気データ取得成功: ${response.status}`);
    return response.data;
  } catch (error) {
    logError(context, `❌ OpenWeather API エラー: ${error.message}`);
    throw error;
  }
}

module.exports = { getWeatherByCoords };
