import { categoryStyleMap } from './category-style.js';
import { waitForGoogleMaps } from './utils/wait-maps.js';
import { logInfo, logError } from './utils/logger-client.js';

let sharedInfoWindow;

function createMarker(spot, map) {
  const { lat, lng, name, description, category_for_map } = spot;
  const category = category_for_map || 'unknown';
  const style = categoryStyleMap[category] || categoryStyleMap['unknown'];

  if (!categoryStyleMap[category]) {
    logInfo('map-init', `⚠️ 未定義カテゴリ: "${category}" → default適用`);
  }

  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title: name,
    label: {
      text: style.emoji,
      fontSize: '16px',
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: style.color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#fff',
    },
  });

  marker.addListener('click', () => {
    sharedInfoWindow.setContent(`
      <h3>${name}</h3>
      <p>${description || '(no description)'}</p>
      <small>category: ${category}</small>
    `);
    sharedInfoWindow.open(map, marker);
  });

  logInfo('map-init', `📍 Marker表示: ${name} | category: ${category} | lat=${lat}, lng=${lng}`);
}

function initMap() {
  logInfo('map-init', '🗺️ initMap開始 → 地図を初期化します');

  const center = { lat: 35.681236, lng: 139.767125 }; // 東京駅
  const map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 12,
  });

  sharedInfoWindow = new google.maps.InfoWindow();

  fetch('/api/spots')
    .then(res => res.json())
    .then(spots => {
      logInfo('map-init', `✅ スポット取得成功 → 件数: ${spots.length}`);
      spots.forEach(spot => {
        createMarker(spot, map);
      });
    })
    .catch(err => {
      logError('map-init', '❌ スポット取得失敗');
      console.error(err);
    });
}

// ✅ Maps API 読み込みを待ってから初期化
waitForGoogleMaps()
  .then(() => {
    logInfo('map-init', '✅ Google Maps API 読み込み完了 → initMap() 実行');
    initMap();
  })
  .catch(err => {
    logError('map-init', '❌ Google Maps API 読み込みに失敗');
    console.error(err);
  });
