// app/config.js

require('dotenv').config();

const APP_ENV = process.env.APP_ENV || 'dev';

// ✅ バリデーション：APP_ENV の妥当性をチェック
if (!['dev', 'prod', 'test'].includes(APP_ENV)) {
  throw new Error(`[Config Error] APP_ENV must be "dev", "prod", or "test" — got: "${APP_ENV}"`);
}

const isProd = APP_ENV === 'prod';
const isDev = APP_ENV === 'dev';
const isTest = APP_ENV === 'test';

const config = {
  env: APP_ENV,
  isProd,
  isDev,
  isTest,

  // 🔑 API Keys
  OPENAI_API_KEY: isProd
    ? process.env.OPENAI_API_KEY_PROD
    : process.env.OPENAI_API_KEY_DEV,

  GOOGLE_API_KEY: isProd
    ? process.env.GOOGLE_API_KEY_PROD
    : process.env.GOOGLE_API_KEY_DEV,

  OPENWEATHER_API_KEY: isProd
    ? process.env.OPENWEATHER_API_KEY_PROD
    : process.env.OPENWEATHER_API_KEY_DEV,

  DEEPSEEK_API_KEY: isProd
    ? process.env.DEEPSEEK_API_KEY_PROD
    : process.env.DEEPSEEK_API_KEY_DEV,

  // 📊 Google Sheets: Spot  
  SHEET_ID_SPOT: isProd
    ? process.env.SHEET_ID_SPOT_PROD
    : process.env.SHEET_ID_SPOT_DEV,
  
  SHEET_NAME_SPOT: isProd
    ? process.env.SHEET_NAME_SPOT_PROD
    : process.env.SHEET_NAME_SPOT_DEV,
  
  // 📊 Google Sheets: Keywords
  SHEET_ID_KEYWORDS: isProd
    ? process.env.SHEET_ID_KEYWORDS_PROD
    : process.env.SHEET_ID_KEYWORDS_DEV,

  SHEET_NAME_KEYWORDS: isProd
    ? process.env.SHEET_NAME_KEYWORDS_PROD
    : process.env.SHEET_NAME_KEYWORDS_DEV,
  
  // 📊 Google Sheets: Weather
  SHEET_ID_WEATHER: isProd
    ? process.env.SHEET_ID_WEATHER_PROD
    : process.env.SHEET_ID_WEATHER_DEV,

  SHEET_NAME_WEATHER: isProd
    ? process.env.SHEET_NAME_WEATHER_PROD
    : process.env.SHEET_NAME_WEATHER_DEV,

  // 📊 Log Sheet（dev/testのみ）
  SHEET_NAME_LOGS: process.env.SHEET_NAME_LOGS_DEV, // logs は開発・検証のみ

  // 🔐 Credentials 認証情報
  GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH_DEV, // ← dev 用の認証ファイルパス
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS, // ← .envに明示的に書かれている場合用

  // 📧 Gmail 通知
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_APP_PASSWORD,
  GMAIL_TO: process.env.GMAIL_TO,

  // 💱 為替情報（仮運用）
  EXCHANGE_RATE_USD: parseFloat(process.env.EXCHANGE_RATE_USD || '0.0065'),
  EXCHANGE_TIMESTAMP: process.env.EXCHANGE_TIMESTAMP || '',

};

// ✅ SDK連携のための昇格処理（本番または開発環境から）
// 優先順位：GOOGLE_APPLICATION_CREDENTIALS（明示定義） > GOOGLE_CREDENTIALS_PATH（自動昇格）
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  if (config.GOOGLE_APPLICATION_CREDENTIALS) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.GOOGLE_APPLICATION_CREDENTIALS;
  } else if (config.GOOGLE_CREDENTIALS_PATH) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.GOOGLE_CREDENTIALS_PATH;
  }
}

module.exports = config;
