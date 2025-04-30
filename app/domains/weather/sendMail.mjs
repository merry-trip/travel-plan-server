// app/domains/weather/sendMail.mjs

import nodemailer from 'nodemailer';
import { logInfo, logError } from '../../utils/logger.mjs';
import config from '@/config.mjs';

const context = 'domains/weather/sendMail';

/**
 * メール送信処理（Gmail使用）
 * @param {Object} param0
 * @param {string} param0.subject - メールの件名
 * @param {string} param0.text - メール本文
 */
export async function sendMail({ subject, text }) {
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
