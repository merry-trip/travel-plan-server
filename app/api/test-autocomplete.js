// test-scripts/test-autocomplete.js

process.env.APP_ENV = 'test'; // ✅ 安全のためテスト環境を明示

const axios = require("axios");
const { logInfo, logError } = require("../app/utils/logger");
const config = require("../app/config");

async function testAutocomplete() {
  const context = "test-autocomplete";

  try {
    logInfo(context, `📨 Autocompleteリクエスト送信中（env=${config.env}）`);

    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete?key=${config.GOOGLE_API_KEY}`,
      {
        input: "mandarake sh",
        languageCode: "en",
        regionCode: "JP"
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
    logError(context, `❌ Autocompleteエラー: ${error.message}`);
  }
}

testAutocomplete();
