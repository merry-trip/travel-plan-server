// server.js

// 必要なライブラリを読み込む
const express = require('express'); // サーバーを作るためのメイン道具
const dotenv = require('dotenv');   // .env という秘密メモ帳を読み込む道具
const cors = require('cors');       // 外からのアクセスを許可する鍵の道具

// 天気APIの関数を読み込む（ファイルパスに注意）
const { getWeatherByCoords } = require('./api/test-weather'); //名前を指定して、関数だけ取り出す

// .env ファイルの内容を読み込む
dotenv.config();

// Expressアプリを作成
const app = express();
const PORT = process.env.PORT || 3000;

// CORSを許可（ブラウザなどからアクセスできるように）
app.use(cors());

// 天気APIのルート設定
app.get('/api/test-weather', async (req, res) => {
  const { lat, lon, units = 'metric', lang = 'en' } = req.query;

  // 入力チェック
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat（緯度）とlon（経度）は必須です' });
  }

  try {
    // 天気データ取得
    const data = await getWeatherByCoords(lat, lon, units, lang);
    res.json(data);
  } catch (error) {
    console.error('天気APIエラー:', error.message);
    res.status(500).json({ error: '天気情報の取得に失敗しました' });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`✅ サーバー起動中 → http://localhost:${PORT}`);
});
