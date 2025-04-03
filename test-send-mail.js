// test-send-mail.js
const { sendNotificationEmail } = require('./app/api/send-mail');
require('dotenv').config();

sendNotificationEmail(
  '✅ 通知テスト成功',
  'このメールは Node.js の通知テストです。\n設定は正常に動作しています。'
);
