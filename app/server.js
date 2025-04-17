// server.js

process.env.APP_ENV = process.env.APP_ENV || 'dev'; // ✅ 安全のため明示

// 必要なライブラリを読み込む
const express = require('express');
const cors = require('cors');
const path = require('path');

// 🔁 モジュール読み込み
const config = require('./config'); // ✅ config 統一導入
const getSpotList = require('./api/get-spots');
const logSearchRouter = require('./routes/log-search');
const { logInfo, logError } = require('./utils/logger');

// アプリケーション作成
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ テンプレートエンジン設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ CORS有効化
app.use(cors());

// ✅ 静的ファイルパスのログ出力
const staticPath = path.join(__dirname, 'public');
logInfo('server', `📂 静的ファイルパス: ${staticPath}`);
app.use(express.static(staticPath));

// ✅ /api/spots：スプレッドシートからアニメスポット一覧取得
app.get('/api/spots', async (req, res) => {
  const context = 'GET /api/spots';
  try {
    const spots = await getSpotList();
    logInfo(context, `📦 Spot list: ${spots.length}件取得`);
    res.status(200).json(spots);
  } catch (error) {
    logError(context, error);
    res.status(500).json({ error: 'Failed to retrieve spot list' });
  }
});

// ✅ /api/log-search：検索ログ記録API
app.use('/api', express.json(), logSearchRouter);

// ✅ /map：EJSテンプレートへAPIキーを渡す
app.get('/map', (req, res) => {
  res.render('map', {
    googleMapsApiKey: config.GOOGLE_API_KEY, // ✅ configから取得
  });
});

// ✅ サーバー起動
app.listen(PORT, () => {
  logInfo('server', `✅ サーバー起動完了 → http://localhost:${PORT}`);
  logInfo('server', `🌐 実行環境: ${config.env}`);
});
