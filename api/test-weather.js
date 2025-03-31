// weather.js
const axios = require('axios');
require('dotenv').config();

async function getWeatherByCoords(lat, lon, units = 'metric', lang = 'en') {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  const response = await axios.get(url, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units,
      lang,
    }
  });

  return response.data;
}

module.exports = { getWeatherByCoords };
