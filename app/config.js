// app/config.js

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

  // 📊 Spreadsheet ID / Sheet names
  SPREADSHEET_ID_SPOTS: process.env.SPREADSHEET_ID_SPOTS,
  SHEET_NAME_SPOTS: isProd
    ? process.env.SHEET_NAME_SPOT_PROD
    : process.env.SHEET_NAME_SPOT_DEV,

  SPREADSHEET_ID_KEYWORDS: process.env.SPREADSHEET_ID_KEYWORDS,
  SHEET_NAME_KEYWORDS: process.env.SHEET_NAME_KEYWORDS,

  SPREADSHEET_ID_WEATHER: isTest
    ? process.env.SHEET_ID_WEATHER_TEST || process.env.SHEET_ID_WEATHER_DEV
    : isProd
    ? process.env.SHEET_ID_WEATHER_PROD
    : process.env.SHEET_ID_WEATHER_DEV,

  SHEET_NAME_WEATHER: isTest
    ? process.env.SHEET_NAME_WEATHER_TEST || process.env.SHEET_NAME_WEATHER_DEV
    : isProd
    ? process.env.SHEET_NAME_WEATHER_PROD
    : process.env.SHEET_NAME_WEATHER_DEV,

  SHEET_NAME_LOGS: process.env.SHEET_NAME_LOGS_DEV, // logs は開発・検証のみ

  // 🔐 認証情報
  GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH_DEV, // prodはSecretsで処理
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,

  // 📧 Gmail 通知
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_APP_PASSWORD,
  GMAIL_TO: process.env.GMAIL_TO,

  // 💱 為替情報（仮運用）
  EXCHANGE_RATE_USD: parseFloat(process.env.EXCHANGE_RATE_USD || '0.0065'),
  EXCHANGE_TIMESTAMP: process.env.EXCHANGE_TIMESTAMP || '',

  // 🔍 その他（開発用オプションなど）
  DEV_SHEET_NAME: process.env.DEV_SHEET_NAME,
};

module.exports = config;
