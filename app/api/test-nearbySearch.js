// test-nearbySearch.js
require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

async function testNearbySearch() {
  try {
    const response = await axios.post(
      `https://places.googleapis.com/v1/places:searchNearby?key=${API_KEY}`,
      {
        locationRestriction: {
          circle: {
            center: {
              latitude: 35.6595,
              longitude: 139.7005
            },
            radius: 1000  // 半径1km
          }
        },
        includedTypes: ["tourist_attraction"],
        maxResultCount: 3,
        languageCode: "en"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress"
        }
      }
    );

    console.log("✅ Nearby結果：");
    console.dir(response.data, { depth: null });
  } catch (error) {
    console.error("❌ エラー:", error.response?.data || error.message);
  }
}

testNearbySearch();
