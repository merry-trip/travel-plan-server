// test-scripts/writeSpot.test.mjs

import { writeSpot } from '../app/domains/spots/writeSpot.mjs';
import { logInfo, logError } from '../app/utils/logger.mjs';
import config from '../app/config.mjs';

process.env.APP_ENV = 'test'; // ✅ テスト環境明示

const context = 'writeSpot.test';

// ✅ テスト用スポットデータ
const spot = {
  placeId: 'test123',
  name: 'Test Spot',
  lat: 35.6895,
  lng: 139.6917,
  status: 'done', // ✅ 状態を追加してログ追跡しやすくする
};

try {
  logInfo(context, `🧪 writeSpot テスト開始（env=${config.env}）`);
  await writeSpot(spot);
  logInfo(context, '✅ writeSpot テスト成功');
} catch (err) {
  logError(context, `❌ writeSpot テスト失敗: ${err.message}`);
}
