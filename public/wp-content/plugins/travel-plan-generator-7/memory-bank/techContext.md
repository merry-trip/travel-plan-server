# Technical Context: Travel Plan Generator 7

## 開発環境
- サーバー環境: コノハウイング
- プラットフォーム: WordPress（コクーンテーマ使用）
- サーバーサイド: PHP
- フロントエンド: JavaScript（AJAX、jQuery利用）

## 使用するAPI
- 生成AI (ChatGPT API/Gemini): ユーザー入力に基づく旅行プラン生成
- OpenWeather API: 旅行先の天気情報取得
- Routes API: 出発地から目的地までの移動ルート取得
- Geocoding API & Places API（NEW）: 地理情報、観光スポット、宿泊施設などの詳細情報取得

## セキュリティとパフォーマンス
- 入力データのサニタイズ・バリデーションの徹底
- APIキーはwp.config.phpで管理（セキュアな環境変数として利用）
- エラーハンドリングとログ管理の実装
- キャッシュの活用によるレスポンス高速化