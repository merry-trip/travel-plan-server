// app/utils/auth.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const context = 'auth';

/**
 * Google Sheets API 用の認証クライアントを返す
 * @returns {GoogleAuth} 認証済みクライアント
 */
function getAuthClient() {
  try {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const fullPath = path.resolve(__dirname, '../../', keyPath);
    const keyFile = fs.readFileSync(fullPath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    logger.logInfo(context, 'Auth client created successfully');
    return auth;
  } catch (error) {
    logger.logError(context, `Failed to load Google credentials: ${error.message}`);
    throw error;
  }
}

module.exports = { getAuthClient };
