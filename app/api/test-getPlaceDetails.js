// test-getPlaceDetails.js（logger対応）
require("dotenv").config();
const axios = require("axios");
const { logInfo, logError } = require("./utils/logger"); // ✅ ロガー追加

const API_KEY = process.env.GOOGLE_API_KEY;

async function testGetPlaceDetails() {
  const context = "test-getPlaceDetails";

  try {
    const placeId = "ChIJF2HRSKiMGGAR1qOAPQK1yko"; // まんだらけ渋谷店

    logInfo(context, `📨 placeId=${placeId} の詳細を取得中...`);

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}?key=${API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*"  // ← フィールド指定。実運用では必要項目のみに
        }
      }
    );

    logInfo(context, "✅ PlaceDetails 結果:");
    logInfo(context, JSON.stringify(response.data, null, 2));
  } catch (error) {
    logError(context, error);
  }
}

testGetPlaceDetails();
