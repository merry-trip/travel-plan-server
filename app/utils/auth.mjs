// app/utils/auth.mjs

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError } from './logger.mjs';
import config from '@/config.mjs';

const context = 'auth';

// ESM対応
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * サービスアカウント認証情報を読み込む
 * @returns {object} 認証情報オブジェクト（client_email, private_keyなど）
 */
function getCredentials() {
  try {
    const keyPath = config.GOOGLE_CREDENTIALS_PATH || config.GOOGLE_APPLICATION_CREDENTIALS;
    const fullPath = path.resolve(__dirname, '../../', keyPath);

    if (!fs.existsSync(fullPath)) {
      logError(context, `❌ 認証ファイルが存在しません: ${fullPath}`);
      throw new Error(`認証ファイルが見つかりません: ${fullPath}`);
    }

    logInfo(context, `✅ 認証ファイルパス: ${fullPath}`);
    const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    return parsed;
  } catch (error) {
    logError(context, `❌ 認証ファイル読み込み失敗: ${error.message}`);
    throw error;
  }
}

/**
 * Google Sheets API用 認証クライアント（google.auth.JWT）を返す
 * @returns {Promise<google.auth.JWT>}
 */
async function getAuthClient() {
  try {
    logInfo(context, '🔍 getAuthClient() 開始');
    const creds = getCredentials();

    const authClient = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    logInfo(context, '✅ getAuthClient() クライアント作成完了');

    // 🔥 認証トークン取得を試みる
    await authClient.authorize();
    logInfo(context, '✅ getAuthClient() 認証成功');

    return authClient;
  } catch (error) {
    logError(context, `❌ getAuthClient() エラー: ${error.message}`);
    throw error;
  }
}

/**
 * Google Sheets API クライアント（REST版）を返す
 * @returns {Promise<google.sheets_v4.Sheets>}
 */
async function getSheetClient() {
  try {
    logInfo(context, '🔍 getSheetClient() 開始');
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    logInfo(context, '✅ getSheetClient() 作成成功');
    return sheets;
  } catch (error) {
    logError(context, `❌ getSheetClient() エラー: ${error.message}`);
    throw error;
  }
}

// 👇ここ重要！！ exportを必ず書く
export { getAuthClient, getSheetClient };
