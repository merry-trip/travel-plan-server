// server.mjs

process.env.APP_ENV = process.env.APP_ENV || 'dev'; // ✅ 安全のため環境明示

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config.mjs';
import getSpotList from './app/api/get-spots.mjs';
import { handler as projectStatusHandler } from './app/api/project-status.mjs';
import logSearchRouter from './app/routes/log-search.mjs';
import { logInfo, logError } from './app/utils/logger.mjs';

// ✅ __dirname 再現（ESM用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// アプリケーション作成
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ テンプレートエンジン設定（EJS）
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ CORS有効化
app.use(cors());

// ✅ 静的ファイル（/public）提供
const staticPath = path.join(__dirname, 'public');
logInfo('server', `📂 静的ファイルパス: ${staticPath}`);
app.use(express.static(staticPath));

// ✅ /api/spots：スプレッドシートから取得
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

// ✅ /api/project-status：ナレッジ検索用
app.get('/api/project-status', projectStatusHandler);

// ✅ /api/log-search：検索ログの記録
app.use('/api', express.json(), logSearchRouter);

// ✅ /map：地図表示ページにAPIキーを渡す
app.get('/map', (req, res) => {
  res.render('map', {
    googleMapsApiKey: config.GOOGLE_API_KEY,
  });
});

// ✅ サーバー起動
app.listen(PORT, () => {
  logInfo('server', `✅ サーバー起動完了 → http://localhost:${PORT}`);
  logInfo('server', `🌐 実行環境: ${config.env}`);
});
