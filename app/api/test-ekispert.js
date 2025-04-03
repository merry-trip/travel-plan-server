// ========================================
// 🚄 駅すぱあとAPI プロ仕様テストコード
// ファイル名: test-ekispert-pro.js
// ========================================

const axios = require('axios');

// ✅ API設定（フリープラン用アクセスキー）
const API_KEY = '（APIキー入力）';

// ✅ 検索条件（駅名は正式名称・時間はキリの良い値を推奨）
const FROM_STATION = '渋谷';
const TO_STATION = '新宿';
const date = '20250404';  // YYYYMMDD形式
const time = '0930';      // HHMM形式（キリのよい時間推奨）

// =========================
// 🔍 ルート検索本体
// =========================
async function searchRoute() {
  const endpoint = 'https://api.ekispert.jp/v1/json/search/course/light';

  console.log('📡 駅すぱあとAPIリクエスト開始');
  console.log('🔑 APIキー:', API_KEY);
  console.log('🚉 出発駅:', FROM_STATION);
  console.log('🚉 到着駅:', TO_STATION);
  console.log('📅 日時指定:', date, time);

  try {
    const response = await axios.get(endpoint, {
      params: {
        key: API_KEY,
        from: FROM_STATION,
        to: TO_STATION,
        date,
        time,
        // type: 'dep' ← ✅ 削除！type=dep は、通常版API（/search/course）でしか使えません
      },
    });

    console.log('✅ レスポンス受信（HTTPステータス）:', response.status);

    // 🔍 全体構造をログ（開発時のみ表示）
    console.log('\n📦 受信データ（response.data）:');
    console.dir(response.data, { depth: null });

    const result = response.data?.ResultSet;

    // ✅ エラーオブジェクトがある場合
    if (result?.Error) {
      console.error('❌ 駅すぱあとAPIエラー:', result.Error);
      return;
    }

    // ✅ Course が存在しない・空配列だった場合
    const courses = result?.Course;
    if (!courses || (Array.isArray(courses) && courses.length === 0)) {
      console.warn('⚠️ ルート情報（Course）が見つかりませんでした');
      return;
    }

    // ✅ 最初のルートを抽出
    const course = courses[0];

    console.log(`\n🚀 ルート情報取得成功：${FROM_STATION} → ${TO_STATION}`);
    console.log('🕐 所要時間:', course.TimeOnBoard + '分');
    console.log('💰 料金:', course.Price?.[0]?.Oneway || '不明');

    // ✅ 駅リスト出力
    console.log('\n📍 経路駅一覧:');
    course.Route?.Point?.forEach((point, index) => {
      console.log(`  ${index + 1}. ${point.Station?.Name || '??'}`);
    });

  } catch (error) {
    // ✅ 通信 or APIレベルのエラーをキャッチ
    if (error.response) {
      console.error('❌ HTTPエラー:', error.response.status);
      console.dir(error.response.data, { depth: null });
    } else {
      console.error('❌ 通信エラー:', error.message);
    }
  }
}

// ✅ 実行開始
searchRoute();
