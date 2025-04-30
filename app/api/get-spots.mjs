// app/api/get-spots.mjs

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { logInfo, logError } from '../utils/logger.mjs';
import config from '@/config.mjs';

const context = 'get-spots';

const keyFilePath = path.resolve(config.GOOGLE_CREDENTIALS_PATH);
const spreadsheetId = config.SHEET_ID_SPOT;
const sheetName = config.SHEET_NAME_SPOT;

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

/**
 * Google Sheets（anime_spot_db）からスポット一覧を取得し整形する
 * @returns {Promise<Array<Object>>}
 */
export default async function getSpotList() {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:H`, // name, lat, lng, description, placeId, types, source_type, category_for_map
    });

    const values = res.data.values || [];

    logInfo(context, `✅ スポット取得成功：${values.length}件`);
    if (values[0]) {
      logInfo(context, `📌 先頭データ: ${JSON.stringify(values[0])}`);
    }

    return values.map((row) => ({
      name: row[0] ?? '',
      lat: parseFloat(row[1]) || 0,
      lng: parseFloat(row[2]) || 0,
      description: row[3] ?? '',
      placeId: row[4] ?? '',
      types: row[5] ?? '',
      source_type: row[6] ?? '',
      category_for_map: row[7] ?? '',
    }));
  } catch (error) {
    logError(context, `❌ スポット取得失敗: ${error.message}`);
    throw error;
  }
}
