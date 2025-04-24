// app/api/log-search.mjs

import { google } from 'googleapis';
import { logInfo, logError } from '../utils/logger.mjs';
import dayjs from 'dayjs';
import config from '../config.mjs';

const context = 'log-search';

/**
 * 検索ログをスプレッドシートに保存するAPI
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export default async function logSearch(req, res) {
  try {
    logInfo(context, '📌 STEP① リクエスト受信');

    const { search_params } = req.body;
    logInfo(context, `📌 STEP①-1 search_params = ${JSON.stringify(search_params)}`);

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    logInfo(context, '📌 STEP② GoogleAuth 準備OK');

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    const timestampJST = dayjs().format('YYYY-MM-DD HH:mm:ss');
    logInfo(context, `📌 STEP③ JST timestamp = ${timestampJST}`);

    const row = [
      timestampJST,
      JSON.stringify({
        ...search_params,
        exchange: {
          rate: config.EXCHANGE_RATE_USD,
          currency: 'USD',
          exchange_timestamp: config.EXCHANGE_TIMESTAMP,
        },
      }),
    ];

    logInfo(context, `📌 STEP④ row構築完了: ${JSON.stringify(row)}`);

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.SHEET_ID_SPOT, // 専用IDに変更可
      range: `${config.SHEET_NAME_LOGS}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    logInfo(context, `✅ Logged search at ${timestampJST}`);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logError(context, error.message);
    console.error('❌ 詳細エラー:', error); // 開発用
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
