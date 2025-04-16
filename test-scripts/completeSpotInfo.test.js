// test-scripts/completeSpotInfo.test.js
require('dotenv').config(); // ← これを一番上に！

const completeSpotInfo = require('../app/domains/spots/completeSpotInfo');

(async () => {
  const inputText = 'Akihabara Animate';
  const result = await completeSpotInfo(inputText);
  console.log(result);
})();
