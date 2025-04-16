// test-scripts/test-completeFullSpotInfo.js
require("dotenv").config();
const { completeFullSpotInfo } = require("../app/domains/spots/completeFullSpotInfo");

(async () => {
  const keyword = "アニメイト秋葉原"; // ← 任意のスポット名に変更OK
  await completeFullSpotInfo(keyword);
})();
