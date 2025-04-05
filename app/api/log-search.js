// api/log-search.js
const { google } = require("googleapis");
const { logInfo, logError } = require("../utils/logger");
const dayjs = require("dayjs");
require("dotenv").config();

const SHEET_NAME = process.env.SHEET_NAME_LOGS_DEV;
const exchangeRate = parseFloat(process.env.EXCHANGE_RATE_USD);
const exchangeTimestamp = process.env.EXCHANGE_TIMESTAMP || "";

async function logSearch(req, res) {
  try {
    logInfo("log-search", "📌 STEP① リクエスト受信");

    const { search_params } = req.body;
    logInfo("log-search", `📌 STEP①-1 search_params = ${JSON.stringify(search_params)}`);

    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    logInfo("log-search", "📌 STEP② GoogleAuth 準備OK");

    const sheets = google.sheets({ version: "v4", auth });

    const timestampJST = dayjs().format("YYYY-MM-DD HH:mm:ss");
    logInfo("log-search", `📌 STEP③ JST timestamp = ${timestampJST}`);

    const row = [
      timestampJST,
      JSON.stringify({
        ...search_params,
        exchange: {
          rate: exchangeRate,
          currency: "USD",
          exchange_timestamp: exchangeTimestamp,
        },
      }),
    ];
    logInfo("log-search", `📌 STEP④ row構築完了: ${JSON.stringify(row)}`);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    logInfo("log-search", `✅ Logged search at ${timestampJST}`);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    logError("log-search", error);
    console.error("❌ 詳細エラー:", error); // 👈 開発中のみ有効な詳細ログ
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = logSearch;
