export function waitForGoogleMaps() {
    return new Promise((resolve, reject) => {
      const maxRetries = 50; // 最大で約5秒（100ms × 50回）
      let attempts = 0;
  
      const check = () => {
        if (window.google && window.google.maps) {
          resolve(); // Maps API が読み込まれた！
        } else {
          attempts++;
          if (attempts > maxRetries) {
            reject(new Error("❌ Google Maps API の読み込みに失敗しました"));
          } else {
            setTimeout(check, 100); // 100ms ごとに再確認
          }
        }
      };
  
      check();
    });
  }
  