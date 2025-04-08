import { categoryStyleMap } from './category-style.js';

function createMarker(spot, map) {
  const { lat, lng, name, description, category_for_map } = spot;
  const category = category_for_map || 'unknown';
  const style = categoryStyleMap[category] || categoryStyleMap['unknown'];

  if (!categoryStyleMap[category]) {
    console.warn(`⚠️ 未定義カテゴリ: "${category}" → default適用`);
  }

  const label = style.emoji;

  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title: name,
    label: {
      text: label,
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

  const infoWindow = new google.maps.InfoWindow({
    content: `<h3>${name}</h3><p>${description || '(no description)'}</p><small>category: ${category}</small>`,
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

  console.log(`📍 Marker表示: ${name} | category: ${category} | lat=${lat}, lng=${lng}`);
}

function initMap() {
  console.log('🗺️ initMap開始 → 地図を初期化します');

  const center = { lat: 35.681236, lng: 139.767125 }; // 東京駅
  const map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 12,
  });

  fetch('/api/spots')
    .then(res => res.json())
    .then(spots => {
      console.log(`✅ スポット取得成功 → 件数: ${spots.length}`);
      spots.forEach(spot => {
        createMarker(spot, map);
      });
    })
    .catch(err => {
      console.error('❌ スポット取得失敗:', err);
    });
}

window.initMap = initMap;
