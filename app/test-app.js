// test-app.js

// 東京の緯度・経度（例）
const lat = 35.6895;
const lon = 139.6917;

// 仮にアメリカの人だったとする
const userCountry = 'US'; // ← 実際は自動取得でもOK
const lang = 'en'; // 言語は英語（固定）

// サーバーに天気情報を取りに行く
fetch(`http://localhost:3000/api/test-weather?lat=${lat}&lon=${lon}&userCountry=${userCountry}&lang=${lang}`)
  .then(res => res.json())
  .then(data => {
    const weatherDiv = document.getElementById('weather');

    // 表示の整形
    weatherDiv.innerHTML = `
      <h2>${data.name} の天気</h2>
      <p><strong>気温:</strong> ${data.main.temp}°</p>
      <p><strong>天気:</strong> ${data.weather[0].description}</p>
      <p><strong>風速:</strong> ${data.wind.speed} ${userCountry === 'US' ? 'mph' : 'm/s'}</p>
    `;
  })
  .catch(err => {
    console.error('天気取得エラー:', err);
    document.getElementById('weather').innerText = '天気情報の取得に失敗しました。';
  });
