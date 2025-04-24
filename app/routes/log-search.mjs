// app/routes/log-search.mjs

import express from 'express';
import logSearch from '../api/log-search.mjs';  // ← ESM化された処理本体を読み込み

const router = express.Router();

// POST /api/log-search にアクセスが来たら logSearch を実行
router.post('/log-search', logSearch);

export default router;
