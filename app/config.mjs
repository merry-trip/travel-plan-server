// app/config.mjs

// ルート直下の .env を必ず読み込む設定
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

import fs from 'fs';
import * as logger from './utils/logger.mjs';

// 環境設定
const APP_ENV = process.env.APP_ENV || 'dev';
if (!['dev','prod','test'].includes(APP_ENV)) {
  logger.logError('config', `[Config Error] APP_ENV must be "dev","prod",or "test" — got:"${APP_ENV}"`);
  throw new Error(`[Config Error] Invalid APP_ENV: ${APP_ENV}`);
}
const isProd = APP_ENV==='prod', isDev = APP_ENV==='dev', isTest = APP_ENV==='test';

// 必須 env var リスト（GOOGLE_APPLICATION_CREDENTIALS は除外）
const requiredEnvVars = [
  'APP_ENV',
  isProd ? 'OPENAI_API_KEY_PROD'       : 'OPENAI_API_KEY_DEV',
  isProd ? 'GOOGLE_API_KEY_PROD'       : 'GOOGLE_API_KEY_DEV',
  isProd ? 'OPENWEATHER_API_KEY_PROD'  : 'OPENWEATHER_API_KEY_DEV',
  isProd ? 'DEEPSEEK_API_KEY_PROD'     : 'DEEPSEEK_API_KEY_DEV',
  isProd ? 'SHEET_ID_SPOT_PROD'        : 'SHEET_ID_SPOT_DEV',
  isProd ? 'SHEET_NAME_SPOT_PROD'      : 'SHEET_NAME_SPOT_DEV',
  isProd ? 'SHEET_ID_KEYWORDS_PROD'    : 'SHEET_ID_KEYWORDS_DEV',
  isProd ? 'SHEET_NAME_KEYWORDS_PROD'  : 'SHEET_NAME_KEYWORDS_DEV',
  isProd ? 'SHEET_ID_WEATHER_PROD'     : 'SHEET_ID_WEATHER_DEV',
  isProd ? 'SHEET_NAME_WEATHER_PROD'   : 'SHEET_NAME_WEATHER_DEV',
  'SHEET_NAME_LOGS_DEV',
  'GMAIL_USER','GMAIL_APP_PASSWORD','GMAIL_TO',
  'EXCHANGE_RATE_USD','EXCHANGE_TIMESTAMP',
  isProd ? 'GOOGLE_CREDENTIALS_PATH_PROD' : 'GOOGLE_CREDENTIALS_PATH_DEV'
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    logger.logError('config', `[Config Error] Missing required env var: ${key}`);
    throw new Error(`[Config Error] ${key} is not defined (APP_ENV=${APP_ENV})`);
  }
}

// Google 認証ファイルパス決定
const googleCredentialsPath = isProd
  ? process.env.GOOGLE_CREDENTIALS_PATH_PROD
  : isDev
    ? process.env.GOOGLE_CREDENTIALS_PATH_DEV
    : process.env.GOOGLE_CREDENTIALS_PATH_TEST;

// 認証ファイル存在チェック
if (!fs.existsSync(path.resolve(googleCredentialsPath))) {
  logger.logError('config', `[Config Error] Credentials file not found at ${googleCredentialsPath}`);
  throw new Error(`[Config Error] Credentials JSON missing at ${googleCredentialsPath}`);
}

// Google SDK用環境変数をセット
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(googleCredentialsPath);

// 設定オブジェクト
const config = {
  env: APP_ENV, isProd, isDev, isTest,
  OPENAI_API_KEY:      isProd ? process.env.OPENAI_API_KEY_PROD      : process.env.OPENAI_API_KEY_DEV,
  GOOGLE_API_KEY:      isProd ? process.env.GOOGLE_API_KEY_PROD      : process.env.GOOGLE_API_KEY_DEV,
  OPENWEATHER_API_KEY: isProd ? process.env.OPENWEATHER_API_KEY_PROD : process.env.OPENWEATHER_API_KEY_DEV,
  DEEPSEEK_API_KEY:    isProd ? process.env.DEEPSEEK_API_KEY_PROD    : process.env.DEEPSEEK_API_KEY_DEV,
  SHEET_ID_SPOT:       isProd ? process.env.SHEET_ID_SPOT_PROD       : process.env.SHEET_ID_SPOT_DEV,
  SHEET_NAME_SPOT:     isProd ? process.env.SHEET_NAME_SPOT_PROD     : process.env.SHEET_NAME_SPOT_DEV,
  SHEET_ID_KEYWORDS:   isProd ? process.env.SHEET_ID_KEYWORDS_PROD   : process.env.SHEET_ID_KEYWORDS_DEV,
  SHEET_NAME_KEYWORDS: isProd ? process.env.SHEET_NAME_KEYWORDS_PROD : process.env.SHEET_NAME_KEYWORDS_DEV,
  SHEET_ID_WEATHER:    isProd ? process.env.SHEET_ID_WEATHER_PROD    : process.env.SHEET_ID_WEATHER_DEV,
  SHEET_NAME_WEATHER:  isProd ? process.env.SHEET_NAME_WEATHER_PROD  : process.env.SHEET_NAME_WEATHER_DEV,
  SHEET_NAME_LOGS:     process.env.SHEET_NAME_LOGS_DEV,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_APP_PASSWORD,
  GMAIL_TO:   process.env.GMAIL_TO,
  EXCHANGE_RATE_USD:  parseFloat(process.env.EXCHANGE_RATE_USD),
  EXCHANGE_TIMESTAMP: process.env.EXCHANGE_TIMESTAMP,
  GOOGLE_CREDENTIALS_PATH: googleCredentialsPath,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

export function getConfig(){ return config; }
export default config;
