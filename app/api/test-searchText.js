// test-scripts/test-searchText.js

process.env.APP_ENV = 'test'; // ✅ テスト環境を明示

const axios = require("axios");
const { logInfo, logError } = require("../app/utils/logger");
const config = require("../app/config");

async function testSearchText() {
  const context = "test-searchText";

  try {
    logInfo(context, `🔍 SearchText API リクエスト送信中（env=${config.env}）`);

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:searchText?key=${config.GOOGLE_API_KEY}`,
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
    logError(context, `❌ SearchText API エラー: ${error.message}`);
    if (error.response) {
      logError(context, JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSearchText();
