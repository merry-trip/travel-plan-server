// app/config.mjs

import 'dotenv/config';

const APP_ENV = process.env.APP_ENV || 'dev';

// ✅ バリデーション
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
  OPENAI_API_KEY: isProd ? process.env.OPENAI_API_KEY_PROD : process.env.OPENAI_API_KEY_DEV,
  GOOGLE_API_KEY: isProd ? process.env.GOOGLE_API_KEY_PROD : process.env.GOOGLE_API_KEY_DEV,
  OPENWEATHER_API_KEY: isProd ? process.env.OPENWEATHER_API_KEY_PROD : process.env.OPENWEATHER_API_KEY_DEV,
  DEEPSEEK_API_KEY: isProd ? process.env.DEEPSEEK_API_KEY_PROD : process.env.DEEPSEEK_API_KEY_DEV,

  // 📊 Sheets: Spot
  SHEET_ID_SPOT: isProd ? process.env.SHEET_ID_SPOT_PROD : process.env.SHEET_ID_SPOT_DEV,
  SHEET_NAME_SPOT: isProd ? process.env.SHEET_NAME_SPOT_PROD : process.env.SHEET_NAME_SPOT_DEV,

  // 📊 Sheets: Keywords
  SHEET_ID_KEYWORDS: isProd ? process.env.SHEET_ID_KEYWORDS_PROD : process.env.SHEET_ID_KEYWORDS_DEV,
  SHEET_NAME_KEYWORDS: isProd ? process.env.SHEET_NAME_KEYWORDS_PROD : process.env.SHEET_NAME_KEYWORDS_DEV,

  // 📊 Sheets: Weather
  SHEET_ID_WEATHER: isProd ? process.env.SHEET_ID_WEATHER_PROD : process.env.SHEET_ID_WEATHER_DEV,
  SHEET_NAME_WEATHER: isProd ? process.env.SHEET_NAME_WEATHER_PROD : process.env.SHEET_NAME_WEATHER_DEV,

  // 📊 Log（dev/test 用）
  SHEET_NAME_LOGS: process.env.SHEET_NAME_LOGS_DEV,

  // 🔐 認証ファイル
  GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH_DEV,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,

  // 📧 Gmail
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_APP_PASSWORD,
  GMAIL_TO: process.env.GMAIL_TO,

  // 💱 為替
  EXCHANGE_RATE_USD: parseFloat(process.env.EXCHANGE_RATE_USD || '0.0065'),
  EXCHANGE_TIMESTAMP: process.env.EXCHANGE_TIMESTAMP || '',
};

// ✅ SDK 認証ファイルの昇格処理
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  if (config.GOOGLE_APPLICATION_CREDENTIALS) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.GOOGLE_APPLICATION_CREDENTIALS;
  } else if (config.GOOGLE_CREDENTIALS_PATH) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.GOOGLE_CREDENTIALS_PATH;
  }
}

// ✅ getConfig() を明示的に提供
export function getConfig() {
  return config;
}

export default config;
