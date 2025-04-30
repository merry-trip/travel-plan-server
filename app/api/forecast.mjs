// app/api/forecast.mjs

import axios from 'axios';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '../../config.mjs';

const context = 'api/forecast';

logInfo(context, `現在の環境: ${config.env}`);

/**
 * 指定緯度・経度で天気予報（5日分/3時間ごと）を取得
 * @param {number} lat - 緯度
 * @param {number} lon - 経度
 * @param {string} units - 単位（'metric' or 'imperial'）
 * @param {string} lang - 言語コード（例: 'ja'）
 * @returns {Promise<Object>} - OpenWeather API のレスポンス
 */
export async function getForecastByCoords(lat, lon, units = 'metric', lang = 'en') {
  const url = `https://api.openweathermap.org/data/2.5/forecast`;

  logInfo(context, `🌤️ 天気API呼び出し: lat=${lat}, lon=${lon}, units=${units}, lang=${lang}`);

  try {
    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: config.OPENWEATHER_API_KEY,
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
