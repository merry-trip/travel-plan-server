// app/scripts/test-env.mjs

import dotenv from 'dotenv';
import fs from 'fs';

// .envファイルを読み込む
dotenv.config();

// 環境変数の確認
console.log('APP_ENV:', process.env.APP_ENV);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// ファイル存在確認
const exists = fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('ファイル存在チェック:', exists);
