// app/scripts/test-searchText-types.mjs

import { logInfo, logError, logDebug } from "../utils/logger.mjs";
import config from "../config.mjs";

const API_KEY = config.GOOGLE_API_KEY;
const endpoint = "https://places.googleapis.com/v1/places:searchText";
const context = "collect-types";

const queries = [
  "秋葉原 アニメ",
  "新宿 アニメ",
  "秋葉原 メイド",
  "中野 アニメ",
  "池袋 アニメ",
  "秋葉原 ゲーム",
  "秋葉原 漫画",
  "新宿 マンガ",
  "中野 ゲーム",
  "秋葉原 マンガ"
];

async function run() {
  const allTypes = new Set();

  for (const query of queries) {
    logInfo(context, `🔎 検索: ${query}`);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.types"
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "ja",
          regionCode: "JP"
        })
      });

      const data = await res.json();
      if (!data.places) {
        logError(context, `No results for: ${query}`);
        continue;
      }

      for (const place of data.places) {
        const name = place.displayName?.text || "（名称不明）";
        const types = place.types || [];
        logInfo(context, `📍 ${name}`);
        logDebug(context, `types: ${JSON.stringify(types)}`);
        types.forEach(t => allTypes.add(t));
      }
    } catch (err) {
      logError(context, err);
    }
  }

  const sorted = Array.from(allTypes).sort();
  logInfo(context, `✅ 最終集計 types（${sorted.length}件）:`);
  logInfo(context, sorted.join(", "));
}

// 実行
run();
