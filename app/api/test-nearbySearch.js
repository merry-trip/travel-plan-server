// test-nearbySearch.js（logger対応）
require("dotenv").config();
const axios = require("axios");
const { logInfo, logError } = require("./utils/logger"); // ✅ ロガー追加

const API_KEY = process.env.GOOGLE_API_KEY;

async function testNearbySearch() {
  const context = "test-nearbySearch";

  try {
    logInfo(context, "📡 NearbySearch API を呼び出します...");

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

    logInfo(context, "✅ NearbySearch 結果:");
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, error);
  }
}

testNearbySearch();
