// app/weather-write-to-sheet.mjs

import { logInfo, logError } from './utils/logger.mjs';
import { getForecastByCoords } from './api/forecast.mjs';
import {
  deleteAllDataRows,
  appendWeatherRows,
} from './api/sheets.mjs';
import { sendMail } from './api/send-mail.mjs';
import config from '../config.mjs';

const context = 'weather-write-to-sheet';

async function main() {
  try {
    // ✅ 全行削除（ヘッダー除く）
    logInfo(context, '🧹 既存の天気データをすべて削除します');
    await deleteAllDataRows();

    // ✅ 天気APIから40件取得
    logInfo(context, `🌤️ 天気情報を取得中...（env: ${config.env}）`);
    const forecast = await getForecastByCoords(35.6895, 139.6917, 'metric', 'en');

    const rows = forecast.list.map(entry => [
      entry.dt_txt,
      'Tokyo',
      entry.main.temp,
      entry.weather?.[0]?.description ?? '',
      entry.main.humidity,
      entry.wind.speed,
      entry.main.pressure
    ]);

    logInfo(context, `📝 スプレッドシートに ${rows.length} 件を書き込みます`);
    await appendWeatherRows(rows);

    // ✅ 成功メール通知
    await sendMail({
      subject: '✅ 天気ログ完了',
      text: `スプレッドシートに ${rows.length} 件の天気データを記録しました。\n環境: ${config.env}`
    });

    logInfo(context, '📧 通知メールを送信しました（成功）');
  } catch (err) {
    logError(context, `❌ 書き込みエラー: ${err.message}`);
    logError(context, err.stack);

    await sendMail({
      subject: '❌ 天気ログ失敗',
      text: `エラーが発生しました：${err.message}`
    });

    logInfo(context, '📧 エラー通知メールを送信しました（失敗）');
  }
}

main();
