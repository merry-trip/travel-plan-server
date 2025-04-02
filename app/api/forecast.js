// api/forecast.js（APP_ENV対応）
const axios = require('axios');
require('dotenv').config();

// 現在の環境（dev または prod）を取得
const appEnv = process.env.APP_ENV || 'dev';

// 環境に応じて APIキーを切り替え
const apiKey = appEnv === 'prod'
  ? process.env.OPENWEATHER_API_KEY_PROD
  : process.env.OPENWEATHER_API_KEY_DEV;

async function getForecastByCoords(lat, lon, units = 'metric', lang = 'en') {
  const url = `https://api.openweathermap.org/data/2.5/forecast`;

  const response = await axios.get(url, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units,
      lang,
    }
  });

  return response.data; // 5日分×3時間ごとの天気データ（listの配列）
}

module.exports = { getForecastByCoords };
