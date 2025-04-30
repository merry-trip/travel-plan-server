// app/domains/weather/fetchForecast.mjs

import axios from 'axios';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs'; // ✅ .mjs対応のconfig

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
export async function getForecastByCoords(lat, lon, units = 'metric', lang = 'en') {
  const url = `https://api.openweathermap.org/data/2.5/forecast`;

  logInfo(context, `🌤️ 天気APIリクエスト: lat=${lat}, lon=${lon}, units=${units}, lang=${lang}`);

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units,
        lang,
      },
    });

    logInfo(context, `✅ 天気データ取得成功（件数: ${response.data.list.length}）`);
    return response.data;

  } catch (error) {
    logError(context, `❌ 天気APIエラー: ${error.message}`);
    throw error;
  }
}
