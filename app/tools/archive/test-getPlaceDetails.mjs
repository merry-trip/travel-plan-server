// app/tools/test-getPlaceDetails.mjs

import dotenv from 'dotenv';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger.mjs';
import { writeRowToSheet } from './write-spot-to-sheet.mjs';
import config from '../../config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境フラグを明示
dotenv.config(); // .env 読み込み

const GOOGLE_API_KEY = config.GOOGLE_API_KEY;
const DEEPSEEK_API_KEY = config.DEEPSEEK_API_KEY;
const placeId = 'ChIJAVf7lh2MGGARJylRnQ_3dpI'; // Animate Akihabara

/**
 * DeepSeek API によるレビュー要約とタグ生成
 */
async function getReviewSummaryAndTags(reviewTexts) {
  const prompt = `
Below are English reviews for an anime store.
Please do the following two tasks:
1. Summarize the overall impression in one professional English paragraph (150 characters or fewer).
2. List 3 to 5 characteristic keywords (tags) in English, separated by commas.

Reviews:
${reviewTexts.join("\n\n")}

Output format:
Summary: ...
Tags: ...
`.trim();

  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
    }
  );

  const content = response.data.choices[0].message.content.trim();
  const summaryMatch = content.match(/Summary:\s*(.+)/i);
  const tagsMatch = content.match(/Tags:\s*(.+)/i);

  const summary = summaryMatch?.[1]?.trim() ?? 'n/a';
  const tagsString = tagsMatch?.[1]?.trim() ?? '';
  const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean);

  return { summary, tagsArray };
}

(async () => {
  try {
    logInfo('getPlaceDetails', `🔍 Google API呼び出し開始 → placeId=${placeId}`);

    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const params = {
      key: GOOGLE_API_KEY,
      fields: [
        "id", "displayName", "formattedAddress", "shortFormattedAddress",
        "internationalPhoneNumber", "nationalPhoneNumber", "editorialSummary",
        "location", "rating", "userRatingCount", "websiteUri", "businessStatus",
        "types", "reviews", "takeout", "delivery", "dineIn"
      ].join(",")
    };

    const res = await axios.get(url, { params });
    const data = res.data;

    const spot = {
      placeId,
      name: data.displayName?.text ?? 'n/a',
      lat: data.location?.latitude ?? 'n/a',
      lng: data.location?.longitude ?? 'n/a',
      formatted_address: data.formattedAddress ?? 'n/a',
      short_address: data.shortFormattedAddress ?? 'n/a',
      international_phone: data.internationalPhoneNumber ?? 'n/a',
      phone: data.nationalPhoneNumber ?? 'n/a',
      website_url: data.websiteUri ?? 'n/a',
      rating: data.rating ?? 'n/a',
      ratings_count: data.userRatingCount ?? 'n/a',
      business_status: data.businessStatus ?? 'n/a',
      types: data.types?.join(', ') ?? 'n/a',
      editorial_summary: data.editorialSummary?.text ?? 'n/a',
      takeout: data.takeout ?? false,
      delivery: data.delivery ?? false,
      dineIn: data.dineIn ?? false,
      open_now: 'n/a',
      opening_hours: 'n/a',
      reviews: data.reviews ?? [],
    };

    const reviewTexts = spot.reviews
      .map(r => r.text?.text?.trim())
      .filter(Boolean);

    if (reviewTexts.length > 0) {
      const { summary, tagsArray } = await getReviewSummaryAndTags(reviewTexts);
      spot.short_review_summary = summary;
      spot.tags = tagsArray.join(', ');
      spot.tags_json = JSON.stringify(tagsArray);
    } else {
      spot.short_review_summary = 'n/a';
      spot.tags = '';
      spot.tags_json = '[]';
    }

    logInfo('getPlaceDetails', `✅ Spot構造整形完了: ${spot.name}`);
    console.log("📦 書き込み対象:", JSON.stringify(spot, null, 2));

    await writeRowToSheet(spot);
  } catch (error) {
    logError('getPlaceDetails', error.message);
    if (error.response?.data) {
      console.error("[getPlaceDetails] error.response.data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("[getPlaceDetails] error:", error);
    }
  }
})();
