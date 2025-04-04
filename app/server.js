// server.js

// 必要なライブラリを読み込む
const express = require('express'); // サーバーを作るためのメイン道具
const cors = require('cors');       // 外からのアクセスを許可する鍵の道具
const path = require('path');       // 静的ファイル用のパスを扱う道具

// 🔁 スポット取得用の関数（Google Sheets API）
const getSpotList = require('./api/get-spots');

// ✅ ロガーの読み込み（日本時間でINFO / ERROR出力）
const { logInfo, logError } = require('./utils/logger');

// Expressアプリを作成
const app = express();
const PORT = 3000;

// CORSを許可（ブラウザなどからアクセスできるように）
app.use(cors());

// ✅ ここで静的パスをログに出す（原因の絞り込み用）
const staticPath = path.join(__dirname, 'public');
console.log('[DEBUG] 静的ファイルの公開パス:', staticPath);

// public フォルダの中身（test-map.html など）を公開
app.use(express.static(path.join(__dirname, 'public')));

// ✅ /api/spots：Googleスプレッドシートからアニメスポット一覧を取得
app.get('/api/spots', async (req, res) => {
  const context = 'GET /api/spots'; // ログ用文脈ラベル

  try {
    const spots = await getSpotList();
    logInfo(context, `Spot list retrieved: ${spots.length} items`);
    res.status(200).json(spots);
  } catch (error) {
    logError(context, error);
    res.status(500).json({ error: 'Failed to retrieve spot list' });
  }
});

app.get('/test-map', (req, res) => {
  res.redirect('/test-map.html');
});

// サーバーを起動
app.listen(PORT, () => {
  logInfo('server', `✅ サーバー起動中 → http://localhost:${PORT}`);
});
