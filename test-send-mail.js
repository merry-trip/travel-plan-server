// test-scripts/test-send-mail.js

process.env.APP_ENV = 'test'; // ✅ 本番誤送信防止

const { sendMail } = require('../app/api/send-mail'); // ✅ 実際の関数名に合わせて調整
const { logInfo, logError } = require('../app/utils/logger');

(async () => {
  const context = 'test-send-mail';

  try {
    logInfo(context, '📧 メール送信テスト開始...');
    
    await sendMail({
      subject: '✅ 通知テスト成功',
      text: 'このメールは Node.js の通知テストです。\n設定は正常に動作しています。',
    });

    logInfo(context, '✅ 通知テストメール送信完了');
  } catch (err) {
    logError(context, `❌ メール送信失敗: ${err.message}`);
  }
})();
