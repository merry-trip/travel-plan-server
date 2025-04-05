// test-autocomplete.js（logger対応版）
require("dotenv").config();
const axios = require("axios");
const { logInfo, logError } = require("./utils/logger"); // ✅ ロガー追加

const API_KEY = process.env.GOOGLE_API_KEY;

async function testAutocomplete() {
  const context = "test-autocomplete";

  try {
    logInfo(context, "📨 Autocompleteリクエスト送信中...");

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete?key=${API_KEY}`,
      {
        input: "mandarake sh",  // ユーザーが入力し始めた文字
        languageCode: "en",     // 表示言語
        regionCode: "JP"        // 日本に絞って検索
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*"
        }
      }
    );

    logInfo(context, "✅ Autocomplete結果:");
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, error);
  }
}

testAutocomplete();
