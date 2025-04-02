// test-autocomplete.js
require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

async function testAutocomplete() {
  try {
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

    console.log("✅ Autocomplete結果：");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ エラー:", error.response?.data || error.message);
  }
}

testAutocomplete();
