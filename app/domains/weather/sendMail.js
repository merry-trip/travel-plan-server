const nodemailer = require('nodemailer');
const { logInfo, logError } = require('../../utils/logger'); // ✅ パス修正
require('dotenv').config();

async function sendMail({ subject, text }) {
  const context = 'domains/weather/sendMail'; // ✅ context明確化

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
    logError(context, err.stack);
    throw err;
  }
}

module.exports = { sendMail };
