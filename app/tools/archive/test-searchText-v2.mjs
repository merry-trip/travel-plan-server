// app/tools/archive/test-searchText-v2.mjs

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';
import { google } from 'googleapis';
import { logInfo, logError } from '../utils/logger.mjs';

// ✅ __dirname の再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ .env 読み込み
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GOOGLE_API_KEY_DEV;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME_SPOTS_DEV || 'anime_spot_db';

const queries = [
  'Anime Akihabara',
  'Anime Ikebukuro',
  'Anime Nakano',
  'アニメ 秋葉原',
  'アニメ 池袋',
  'アニメ 中野',
  'Anime shinzyuku',
];

async function searchAndSaveAll() {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const existingRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!E2:E`,
  });
  const existingPlaceIds = (existingRes.data.values || []).flat();
  logInfo('searchTextV2', `📌 既存 placeId 数: ${existingPlaceIds.length}`);

  for (const query of queries) {
    try {
      logInfo('searchTextV2', `📌 STEP① 検索開始 → "${query}"`);

      const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.location',
          'places.formattedAddress',
          'places.types',
        ].join(','),
      };

      const body = {
        textQuery: query,
        languageCode: 'en',
        regionCode: 'JP',
      };

      const res = await axios.post(url, body, { headers });
      const results = res.data.places || [];

      logInfo('searchTextV2', `📌 STEP② "${query}" ヒット件数: ${results.length}`);
      let addedCount = 0;

      for (const place of results) {
        const name = place.displayName?.text || '(no name)';
        const address = place.formattedAddress || '(no address)';
        const lat = place.location?.latitude || 'N/A';
        const lng = place.location?.longitude || 'N/A';
        const types = place.types ? JSON.stringify(place.types) : '[]';
        const placeId = place.id || 'UNKNOWN';

        if (existingPlaceIds.includes(placeId)) {
          logInfo('searchTextV2', `⏭️ [${query}] 既に登録済み: ${name}`);
          continue;
        }

        const row = [name, lat, lng, '', placeId, types, 'api'];
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [row] },
        });

        logInfo('searchTextV2', `✅ [${query}] 新規追加: ${name}`);
        existingPlaceIds.push(placeId);
        addedCount++;
      }

      logInfo('searchTextV2', `✅ STEP③ "${query}" 保存完了（${addedCount}件）`);
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message;
      logError('searchTextV2', `❌ "${query}" エラー: ${message}`);
    }
  }

  logInfo('searchTextV2', `✅ STEP④ 全検索処理完了（${queries.length}件のクエリ）`);
}

searchAndSaveAll();
