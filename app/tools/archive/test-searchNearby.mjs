// app/tools/test-searchNearby.mjs

import { google } from 'googleapis';
import axios from 'axios';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '../../config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境明示

const context = 'test-searchNearby';
const keyword = 'アニメ';
const radius = 1500;

const targets = [
  { name: 'Akihabara', location: '35.698683,139.774219' },
  { name: 'Ikebukuro', location: '35.728926,139.71038' },
  { name: 'Nakano', location: '35.7074,139.6659' },
];

async function fetchNearbySpots() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  for (const target of targets) {
    const { name: areaName, location } = target;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
      location,
      radius,
      keyword,
      key: config.GOOGLE_API_KEY,
    };

    try {
      logInfo(context, `📌 STEP① [${areaName}] NearbySearch 実行開始`);

      const res = await axios.get(url, { params });
      const spots = res.data.results;

      logInfo(context, `📌 STEP② [${areaName}] スポット取得数: ${spots.length}`);

      const existingPlaceIdsRes = await sheets.spreadsheets.values.get({
        spreadsheetId: config.SPREADSHEET_ID_SPOTS,
        range: `${config.SHEET_NAME_SPOTS}!E2:E`,
      });
      const existingPlaceIds = (existingPlaceIdsRes.data.values || []).flat();
      logInfo(context, `📌 STEP②-5 [${areaName}] 登録済み place_id 数: ${existingPlaceIds.length}`);

      let addedCount = 0;
      logInfo(context, `📌 STEP③ [${areaName}] 重複チェックと保存を開始`);

      for (const spot of spots) {
        if (existingPlaceIds.includes(spot.place_id)) {
          logInfo(context, `⏭️ [${areaName}] 既に登録済み: ${spot.name}`);
          continue;
        }

        const row = [
          spot.name,
          spot.geometry.location.lat,
          spot.geometry.location.lng,
          '',
          spot.place_id,
          JSON.stringify(spot.types),
          'api',
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: config.SPREADSHEET_ID_SPOTS,
          range: `${config.SHEET_NAME_SPOTS}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [row] },
        });

        addedCount++;
        logInfo(context, `✅ [${areaName}] 新規追加: ${spot.name}`);
      }

      logInfo(context, `✅ STEP④ [${areaName}] 保存完了（${addedCount}件）`);
    } catch (err) {
      logError(context, `[${areaName}] エラー発生: ${err.message}`);
      if (err.response?.data) {
        console.error(JSON.stringify(err.response.data, null, 2));
      }
    }
  }
}

fetchNearbySpots();
