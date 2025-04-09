const express = require("express");
const router = express.Router();
const logSearch = require("../api/log-search");  // ← 処理の本体を読み込み

// POST /api/log-search にアクセスが来たら logSearch を実行
router.post("/log-search", logSearch);

module.exports = router;
