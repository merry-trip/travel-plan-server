// app/api/send-mail.js
const nodemailer = require('nodemailer');
const { logInfo, logError } = require('../utils/logger'); // ✅ logger追加
require('dotenv').config();

async function sendMail({ subject, text }) {
  const context = 'send-mail'; // ✅ ログ用の文脈ラベル

  try {
    logInfo(context, `📧 メール送信準備中（宛先: ${process.env.GMAIL_TO}）`);
    logInfo(context, `📧 件名: ${subject}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Weather Bot" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_TO,
      subject,
      text,
    });

    logInfo(context, '✅ メール送信完了');
  } catch (err) {
    logError(context, `❌ メール送信失敗: ${err.message}`);
    logError(context, err.stack); // スタックトレースも保存
    throw err; // 上位に通知（必要なら再送や通知）
  }
}

module.exports = { sendMail };
