// app/api/send-mail.js

const nodemailer = require('nodemailer');
const { logInfo, logError } = require('../utils/logger');
const config = require('../config'); // ✅ configで統一

const context = 'send-mail';

/**
 * Gmail 経由でメールを送信する
 * @param {Object} param0
 * @param {string} param0.subject - 件名
 * @param {string} param0.text - 本文
 */
async function sendMail({ subject, text }) {
  try {
    logInfo(context, `📧 メール送信準備中（宛先: ${config.GMAIL_TO}）`);
    logInfo(context, `📧 件名: ${subject}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Weather Bot" <${config.GMAIL_USER}>`,
      to: config.GMAIL_TO,
      subject,
      text,
    });

    logInfo(context, '✅ メール送信完了');
  } catch (err) {
    logError(context, `❌ メール送信失敗: ${err.message}`);
    logError(context, err.stack);
    throw err;
  }
}

module.exports = { sendMail };
