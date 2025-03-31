// test-server.js
const express = require('express');
const cors = require('cors');
const { getWeatherByCoords } = require('./api/test-weather')
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors()); // フロント（ブラウザ）からのリクエストを許可

// 天気APIルート
app.get('/api/test-weather', async (req, res) => {
    const { lat, lon, lang = 'en', userCountry } = req.query;
  
    // imperial を使う国
    const imperialCountries = ['US', 'LR', 'MM'];
  
    // userCountryがimperialに該当するかを判定
    const units = imperialCountries.includes(userCountry) ? 'imperial' : 'metric';
  
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat（緯度）とlon（経度）は必須です' });
    }
  
    try {
      const data = await getWeatherByCoords(lat, lon, units, lang);
      res.json(data);
    } catch (error) {
      console.error('天気APIエラー:', error.message);
      res.status(500).json({ error: '天気情報の取得に失敗しました' });
    }
  });  

// サーバー起動
app.listen(PORT, () => {
  console.log(`✅ テストサーバー起動中 → http://localhost:${PORT}`);
});
