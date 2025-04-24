// app/utils/auth.mjs

import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import config from '../config.mjs';
import logger from './logger.mjs';

const context = 'auth';

// ESM対応：__dirname を安全に再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Google Sheets API 用の認証オブジェクトを返す
 * @returns {object} 認証オブジェクト（client_email と private_key を含む）
 */
function getCredentials() {
  try {
    const keyPath = config.GOOGLE_CREDENTIALS_PATH || config.GOOGLE_APPLICATION_CREDENTIALS;

    if (!keyPath) {
      logger.logError(context, '❌ 認証ファイルパスが未定義です（GOOGLE_CREDENTIALS_PATH or GOOGLE_APPLICATION_CREDENTIALS）');
      throw new Error('認証ファイルのパスが未定義です');
    }

    const fullPath = path.resolve(__dirname, '../../', keyPath);

    if (!fs.existsSync(fullPath)) {
      logger.logError(context, `❌ 認証ファイルが存在しません: ${fullPath}`);
      throw new Error(`認証ファイルが見つかりません: ${fullPath}`);
    }

    logger.logInfo(context, `✅ 認証ファイルパス: ${fullPath}`);
    const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    const privateKey = parsed.private_key.replace(/\\n/g, '\n');

    return {
      client_email: parsed.client_email,
      private_key: privateKey,
    };
  } catch (error) {
    logger.logError(context, `❌ 認証ファイルの読み込みに失敗: ${error.message}`);
    throw error;
  }
}

/**
 * Google Sheets のドキュメントクライアントを返す
 * @returns {Promise<GoogleSpreadsheet>}
 */
async function getSheetClient() {
  try {
    const credentials = getCredentials();

    const doc = new GoogleSpreadsheet(config.SHEET_ID_SPOT);
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });

    await doc.loadInfo(); // ✅ これがないと sheetsByTitle が undefined

    logger.logInfo(context, '✅ Sheets クライアント作成に成功');
    return doc;
  } catch (error) {
    logger.logError(context, `❌ Sheets クライアント作成失敗: ${error.message}`);
    throw error;
  }
}

// export：default（主要）＋ named（テストや拡張に対応）
export { getSheetClient };
export default {
  getSheetClient,
};
