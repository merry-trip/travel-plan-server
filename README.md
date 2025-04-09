# travel-plan-server

このサービスは、訪日外国人向けに「アニメ・マンガ聖地巡礼ルート」を自動生成・地図表示し、天気や検索ログも記録する Node.js ベースのWebアプリケーションです。
地図上のマーカー表示だけでなく、天気予報の取得と保存、通知メールの送信、スプレッドシートへのログ記録など、運用を前提とした自動化処理にも対応しています。

## 🔖 v1.2.0 完了（2025/04/04）

### ✅ フェーズ内容：地図表示とスポット連携の実装

- Google Maps JavaScript API による地図表示（東京駅を中心）
- /api/spots にて Google Sheets API 経由でスポット一覧を取得
- 各スポットを地図上にマーカー表示し、クリックで吹き出し（name + description）を表示
- logger.js による INFO ログ記録（時刻・件数・先頭データの内容）
- /test-map アクセス時の .html リダイレクト対応済

---

### 🔎 動作確認手順（ローカル開発用）

bash
# サーバー起動（プロジェクトルートにて）
node app/server.js

- その後、ブラウザで以下にアクセス：

- http://localhost:3000/test-map.html
- 地図が表示される
- 10件のスポットがピンで表示される
- 各ピンをクリックするとスポット名＋説明が吹き出し表示される
- logger.js による開発ログの確認を重視（テスト・運用設計に活用）
- 今後の開発を見越して「フロント」と「API処理」を分離構成
- .html リダイレクトによりUIテスト時の安定性を向上


---

### 💡 補足：日本語メイン／英語メインの切り替えも自由！

- 外部向け公開が目的なら英語
- 自分用 or チーム内なら日本語メインでOK

---

## ✅ Step 3：保存して `git add` & `commit`（任意）
bash
git add README.md
git commit -m "📝 ドキュメント更新：v1.2.0 地図表示フェーズ完了を記録"

---

## 📦 使用している外部モジュール

- axios : 1.8.4
- dotenv : 16.4.7
- ejs : 3.1.10
- express : 4.21.2
- googleapis : 148.0.0
- nodemailer : 6.10.0

## 🧭 次回以降の注意点リスト（開発用メモ）

- PATH確認を事前に（where npm / where node）
- execSyncでshell指定よりnpm.cmdを優先
- cwdは__dirnameベースで明示的に
- loggerによるステップ記録で再現性確保
- 同じ変数名でconstを再宣言しない（letで先に宣言して使い回す）
- README.md などファイルパスの解決は絶対パスで

---

## 🚀 このプロジェクトについて

このサービスは、訪日外国人向けに「アニメ・マンガ聖地巡礼ルート」を自動生成・地図表示し、天気や検索ログも記録する Node.js ベースのWebアプリケーションです。

---

## 📒 開発ルール（プロ仕様）

- **logger.js による全ファイルのログ管理を徹底**
  - INFO / ERROR を時刻付きで記録
  - 日本時間で記録（JST対応）
- .gitignore に logs/ を追加し、ログはGit管理対象外

---

## 🔄 バージョン履歴

### ✅ v1.2.0（2025/04/04）

- 地図表示（Google Maps JavaScript API）
- /api/spots によるスポット取得（Google Sheets API）
- logger.js による統一ログ出力の導入（INFO / ERROR）

### 🛠 v1.3.0（準備中）

- ピンの色分け
- スポットのジャンル別アイコン表示
- 検索ログの記録（POSTリクエスト）

###  v1.0.1（2025/04/05）

- OpenWeather API（forecast）を用いた5日間天気データ取得処理を本番化
- Google Sheets API によるスプレッドシートへの天気ログ保存を自動化
- すでに存在する日時データを自動削除後、再追加（重複回避）
- 過去の天気ログ（今日以前）を削除するクリーニング処理を実装
- Gmail による実行結果通知（成功 / エラー）を送信（send-mail.js）
- GitHub Actions による毎日6:00 JSTの自動実行（.github/workflows/weather.yml）

###  処理フロー（map.ejs → log-search）」検索ログが保存されるまでの流れ

📍 map.ejs（UI画面）
└─ fetch("/api/log-search", {
      method: "POST",
      body: JSON.stringify({ search_params }),
      headers: { "Content-Type": "application/json" }
   });

↓（サーバーにリクエストが届く）

🧠 server.js
   └─ app.use("/api", logSearchRouter)

↓（/log-search にマッチ）

🛣️ routes/log-search.js
└─ router.post("/log-search", logSearch);

↓（ログ保存処理を呼び出す）

🧠 api/log-search.js
└─ Google Sheets に timestamp + search_params を記録
     - JSTでの日時を記録
     - 為替情報（USD → JPY）もJSONに含めて記録

### ✅ 実行ログ（サーバーコンソール出力）

```bash
[2025/4/07 15:54:08] [INFO] [server] ✅ サーバー起動中 → http://localhost:3000
[2025/4/07 15:54:31] [INFO] [log-search] 📌 STEP① リクエスト受信
[2025/4/07 15:54:31] [INFO] [log-search] 📌 STEP①-1 search_params = {...}
[2025/4/07 15:54:31] [INFO] [log-search] 📌 STEP② GoogleAuth 準備OK
[2025/4/07 15:54:31] [INFO] [log-search] 📌 STEP③ JST timestamp = 2025-04-07 15:54:31
[2025/4/07 15:54:31] [INFO] [log-search] 📌 STEP④ row構築完了: [...]
[2025/4/07 15:54:32] [INFO] [log-search] ✅ Logged search at 2025-04-07 15:54:31

### ✅ 動作確認日：2025/04/07
POST による /api/log-search 成功確認済み（ステータス200）
スプレッドシート anime_search_logs に1行追加されたことを確認
JST時刻でのタイムスタンプ、および為替情報も正しく記録された
logger.js による全ステップログも出力確認済み

###  ✅ 実装ステータス：完了（v1.3.0）
 /api/log-search に対応するルーティングを server.js 経由で登録
 routes/log-search.js にて POST ルート定義
 api/log-search.js で Sheets API による保存処理実行
 logger によりステップ別にログ出力（JST対応）

###  🧾 使用している環境変数（.env）

SHEET_NAME_LOGS_DEV=log_sheet_dev
SPREADSHEET_ID=xxxxxxxxxxxxxxxxxx
EXCHANGE_RATE_USD=147.2
EXCHANGE_TIMESTAMP=2025-04-05 10:00:00
※ .env.production に切り替えることで、本番用シートに保存可能。

### 🧰 プロ仕様：地図描画ロジックの分離構成（v1.3.1〜）:2025/04/08

地図表示処理において、責務ごとにロジックを分割することで、保守性・再利用性・テスト性を高めた構成を採用しています。

### ✅ ファイル構成（フロントエンド）
views/map.ejs	地図表示用のテンプレートHTML（Google Maps APIの読み込み・callback）
public/js/map-init.js	地図初期化処理・マーカー表示（ピン色・絵文字も含む）
public/js/category-style.js	各カテゴリごとの表示スタイル（色・アイコン）を定義するマップ

### ✅ メリット（運用観点）
表示ロジックとデータロジックが完全に分離
UIデザイン調整（色・絵文字）を category-style.js のみで変更可能
map-init.js はAPI取得と地図描画のみに集中
map.ejs にはHTML構造とスクリプト読み込みだけ記述し、保守性向上

### ✅ v1.1.0（2025/04/08）

OpenWeather API（forecast）を使った5日間天気データ取得処理を改良
スプレッドシートの常時40行キープ方式に仕様変更
既存の天気データをすべて削除 → 最新40件を追加するシンプル構成に刷新
Gmail通知の件名・本文もそのまま運用
GitHub Actions による自動実行スケジュール（毎日6:00 JST）も継続

### ✅ 処理の流れ v1.1.0（2025/04/08）
1. スプレッドシートの既存データをすべて削除
2. OpenWeather API から forecast（40件）取得
3. スプレッドシートに全件追加（常に最新40件のみが残る）
4. Gmail にて成功 / 失敗通知を送信

### ✅ フォルダ構成の変更点なし（v1.0.1と同じ）
app/
├── api/
│   ├── forecast.js            # 🌤 OpenWeather API 呼び出し
│   ├── sheets.js              # 📄 スプレッドシート操作（全削除・追加）
│   └── send-mail.js           # 📧 Gmail通知
├── utils/
│   └── logger.js              # 📝 ログ出力（日本時間・context付き）
├── weather-write-to-sheet.js # 🎯 メイン実行スクリプト（本番用）

### 🔄 主な仕様変更（v1.1.0）
項目	v1.0.1	v1.1.0
データ削除	今日以前の行のみ削除	全削除してから再追加
重複処理	重複行を検出して個別削除	削除前提のため重複検出不要
保持件数	最大40件になるよう調整	常に40件のみを保存
スプレッドシート構成	追記方式	完全上書き方式

## v1.4.1（2025-04-09）

- Google Maps JavaScript API による地図表示の安定化
- logger-client.js によるクライアント側ログ整備
- 検索ログ送信 `/api/log-search` スクリプトを map.ejs に実装（現在は自動送信を一時停止）
- 為替レート表示（例：JPY → USD）UIを `<small>` で表示

---
