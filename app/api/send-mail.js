// app/api/send-mail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail({ subject, text }) {
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
}

module.exports = { sendMail };
