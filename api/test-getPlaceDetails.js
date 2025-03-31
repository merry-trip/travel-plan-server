// test-getPlaceDetails.js
require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

async function testGetPlaceDetails() {
  try {
    const placeId = "ChIJF2HRSKiMGGAR1qOAPQK1yko"; // まんだらけ渋谷店

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}?key=${API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*"  // ← テストではまずは "*" にするのが安全！
        }
      }
    );

    console.log("✅ GetPlace結果：");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ エラー:", error.response?.data || error.message);
  }
}

testGetPlaceDetails();
