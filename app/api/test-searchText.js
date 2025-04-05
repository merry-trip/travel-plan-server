// test-searchText.js（logger対応）
require("dotenv").config();
const axios = require("axios");
const { logInfo, logError } = require("./utils/logger"); // ✅ logger導入

const API_KEY = process.env.GOOGLE_API_KEY;

async function testSearchText() {
  const context = "test-searchText";

  try {
    logInfo(context, "🔍 SearchText API リクエスト送信中...");

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`,
      {
        textQuery: "Nintendo TOKYO",
        languageCode: "en",
        maxResultCount: 3
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress"
        }
      }
    );

    logInfo(context, "✅ SearchText API 応答を受信しました！");
    logInfo(context, JSON.stringify(response.data, null, 2));

  } catch (error) {
    logError(context, error);
  }
}

testSearchText();
