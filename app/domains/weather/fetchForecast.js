// app/domains/weather/fetchForecast.js

const axios = require('axios');
const { logInfo, logError } = require('../../utils/logger');
const config = require('../../config'); // ✅ config導入

const context = 'domains/weather/fetchForecast';

logInfo(context, `現在の環境: ${config.env}`);

const apiKey = config.OPENWEATHER_API_KEY;

/**
 * 緯度経度に基づき天気予報を取得（5日分3時間ごと）
 * @param {number} lat - 緯度
 * @param {number} lon - 経度
 * @param {string} units - 'metric' or 'imperial'
 * @param {string} lang - 表示言語（例: 'ja'）
 * @returns {Promise<Object>} - OpenWeather forecast response
 */
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
