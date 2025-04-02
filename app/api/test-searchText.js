// test-searchText.js
require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

async function testSearchText() {
  try {
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

    console.log("✅ 結果：");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ エラー:", error.response?.data || error.message);
  }
}

testSearchText();
