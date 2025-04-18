// app/utils/auth.js

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const config = require('../config');

const context = 'auth';

/**
 * Google Sheets API 用の認証クライアントを返す
 * @returns {GoogleAuth} 認証済みクライアント
 */
function getAuthClient() {
  try {
    // ✅ 設定優先順位: config > env（将来の拡張を考慮）
    const keyPath = config.GOOGLE_CREDENTIALS_PATH || config.GOOGLE_APPLICATION_CREDENTIALS;

    // ✅ 明示的に定義されていない場合はエラー
    if (!keyPath) {
      logger.logError(context, '❌ 認証ファイルパスが未定義です（GOOGLE_CREDENTIALS_PATH or GOOGLE_APPLICATION_CREDENTIALS）');
      throw new Error('認証ファイルのパスが未定義です（GOOGLE_CREDENTIALS_PATH）');
    }

    const fullPath = path.resolve(__dirname, '../../', keyPath);

    if (!fs.existsSync(fullPath)) {
      logger.logError(context, `❌ 認証ファイルが存在しません: ${fullPath}`);
      throw new Error(`認証ファイルが見つかりません: ${fullPath}`);
    }

    logger.logInfo(context, `✅ 認証ファイルパス: ${fullPath}`);

    const keyFile = fs.readFileSync(fullPath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    logger.logInfo(context, '✅ Auth client created successfully');
    return auth;
  } catch (error) {
    logger.logError(context, `❌ Failed to load Google credentials: ${error.message}`);
    throw error;
  }
}

module.exports = { getAuthClient };
