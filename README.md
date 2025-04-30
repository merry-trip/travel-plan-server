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
# 📘 Spot Data 管理方針（v1.5.3）

## 🚫 Places API のバージョン方針

本プロジェクトでは **Google Places API（旧版）を一切使用せず、新版（v1）のみを使用する**。

### ✅ 採用API：Places API New（v1）

- 利用するAPIはすべて `https://places.googleapis.com/v1/...` に統一
- 使用API：
  - `places:searchText`
  - `places/{placeId}`
  - `places:searchNearby`（将来的に）
  - `places:autocomplete`（将来的に）
- 呼び出し形式：**POST + JSON ボディ**
- 必ず `X-Goog-FieldMask` ヘッダーで **取得フィールドを明示**
- APIキーは `.env` の `GOOGLE_API_KEY_DEV` を使用（開発時）

### ❌ 非採用：旧版 API の禁止リスト

| URL形式 | 理由 |
|---------|------|
| `https://maps.googleapis.com/maps/api/place/details/json?...` | 旧版：サポート終了予定、互換性なし |
| `https://maps.googleapis.com/maps/api/place/search/json?...` | 検索精度／構造が新版と異なる |
| `embed maps` 経由での Place ID 抽出 | 形式が非推奨・安定しない |

### 🧠 運用ルール

- `placeId` は **SearchText API (v1)** で毎回取得する
- 保存した `placeId` がエラーとなった場合は再取得する（自動／手動）
- `enrichSpotDetails.js` では **新版の Place ID のみ対応**
- logger によって、失敗ログ・エラー内容は常時記録される

---

## 📌 補足

Places API v1 は **fieldMask が必須**であり、不要なフィールドを省略できる点で料金対策にも有効です。

📘  Spot Data Summary（v1.5.3）

✅ ここまでの成果（完了済）
項目
内容
.env による環境分岐
APP_ENV=dev により、開発時はローカル／スプレッドシートは本番IDに書き込む設計
スプレッドシート管理
.env に SPREADSHEET_ID_SPOTS を追加し、APIキー切替と構成を統一
シート名の統一
本番用スプレッドシートのタブ名は spots に統一
ログ設計
logger.js により、INFO / ERROR / DEBUG ログを出力＆記録（日本時間、context付き）
SearchText API 導入
searchTextSpot.js により、検索語から有効な placeId を取得可能に
GetPlaceDetails 補完処理
enrichSpotDetails.js により、API経由で詳細情報を補完・整形可能に


🚀 これからやるべきこと（v1.5.3 以降）
ステップ
内容
⏳ カラム順の定義
columnOrder.js：A1行と完全一致を維持
⏳ データ整形
rowMapper.js：columnOrderに準拠
⏭ バリデーション処理
validateSpot.js による必須項目／型チェック
⏭ 書き込み処理（1件）
writeSpot.js によるバリデーション＋行変換＋appendRow
⏭ 複数件書き込み
writeSpots.js によるバッチ書き込み（appendRows()）
⏭ 自動補完
DeepSeek による自然文補完（v1.6.0〜）
⏭ GitHub Actions
spots-write.yml による定期処理＋通知


📁 ディレクトリ構成（v1.5.3時点）
cpp
コピーする編集する
app/
├── domains/
│   └── spots/
│       ├── columnOrder.js
│       ├── rowMapper.js
│       ├── validateSpot.js
│       ├── writeSpot.js
│       ├── writeSpots.js
│       ├── enrichSpotDetails.js   // ✅ 詳細補完API処理
│       ├── searchTextSpot.js      // ✅ 検索 → placeId取得
│       └── completeSpotInfo.js    // DeepSeek補完（予定）
└── utils/
    └── logger.js                  // ✅ logInfo, logError, logDebug を提供

test-scripts/
├── enrichSpotDetails.test.js      // ✅ GetPlaceDetails動作確認済
└── searchTextSpot.test.js         // ✅ SearchText API動作確認済


💡 よくあるミスと改善策（再掲）
問題点
改善策
placeIdが無効になる
必ず SearchText API で最新版を取得する設計に
logger.debug is not a function
logger.logDebug() に統一し、logger.jsに関数を追加
fieldMask の未指定
SearchText API呼び出し時に X-Goog-FieldMask を明示的に指定する


📦 スポットデータ構成（v1.5.2時点）
①【基本情報（Places API new）】
placeId [必須]
name [必須]
lat [必須]
lng [必須]
formatted_address [使用中]
types [Google分類]
source_type [使用中]
category_for_map [手動分類]
display_name [補完予定]
region_tag [補完予定]


②【詳細情報（GetPlaceDetails）】
website_url [使用中]
rating [使用中]
ratings_count [使用中]
business_status [使用中]
open_now [補完予定]
opening_hours [補完予定]
③【DeepSeek 自動生成】
description [DeepSeek予定]
short_tip_en [DeepSeek予定]
best_time [DeepSeek予定]
photo_ok [DeepSeek予定]
english_menu [DeepSeek予定]
cash_only [DeepSeek予定]


④【レビュー加工（DeepSeek）】
short_review_summary [DeepSeek]
tags [DeepSeek/UI表示]
tags_json [DeepSeek/JSON]
⑤【周辺・移動・利便性】
nearest_station [補完予定]
walking_time_from_station [補完予定]
related_spots [未使用]
has_foreign_currency_atm [補完予定]
has_free_wifi [補完予定]
rental_cycle_nearby [補完予定]


⑥【UX・人気分析】
search_count [ログ集計]
search_popularity [ログ集計]
visit_feedback_score [ユーザー投稿]
user_tags [ユーザー投稿]
verified [確認用]
note [備考]
last_updated_at [自動記録]



🧠 運用ルール（READMEにも記載予定）
項目
ルール
カラム構成の管理
app/domains/spots/columnOrder.js に記述し、A1行と完全一致に保つ
バリデーション処理
validateSpot.js に定義し、writeSpot.js 内で毎回通す設計
テストコード配置
test-scripts/ や .dev/ に一時保存。本番対象は domains/ 配下に統一


🪜 Step形式進行管理（最新版）
Step
内容
状況
✅ Step 0
前提構築（.env, logger, シート構成）
完了
✅ Step 1
カラム定義・整形・バリデーション・1件書き込み
完了
✅ Step 2
複数件の書き込み（writeSpots + appendRows）
完了
✅ Step 3
enrichSpotDetails による詳細補完
完了 ✅
✅ Step 4
SearchText によるplaceId取得（新版）
完了 ✅
⏳ Step 5
search → enrich → write の統合 or 自動化
次ステップ！
⏭ Step 6
GitHub Actionsによるバッチ実行＋通知
未着手
⏭ Step 7
DeepSeekによる自動生成・補完フェーズ
v1.6.0〜予定


🚫 旧版 Places API の非採用方針（明示）
❗ 利用禁止：旧版の Places API（place/details/json など）
今後の本番・開発環境すべてにおいて、旧版（v1.0以前）のPlaces APIエンドポイントは一切使用しないことを明記します。

✅ 採用API：Google Places API New（v1）
項目
内容
API ベースURL
https://places.googleapis.com/v1/...
利用API一覧
places:searchText, places/{placeId}, places:searchNearby, places:autocomplete
呼び出し形式
POST + JSONボディ、X-Goog-FieldMask ヘッダー付きリクエスト
バージョン固定
v1 明記必須（/v1/places/...）
使用ライブラリ
すべて node-fetch ベースのカスタム実装（SDK未使用）
APIキー管理
.env 経由で GOOGLE_API_KEY_DEV を統一利用（開発環境）
データ取得制限
必ず fieldMask 指定で取得フィールドを明示する（API最適化）


🚫 使用禁止とする旧API例
非推奨エンドポイント
理由
https://maps.googleapis.com/maps/api/place/details/json?...
旧版：今後サポート終了予定／新版と互換性なし
https://maps.googleapis.com/maps/api/place/search/json?...
SearchTextの新版で代替可能
place_id 取得に embed maps などを使用
取得精度・形式が不安定。SearchTextで統一する方針


🎯 設計上の保証
ポイント
運用ルール
placeId の取得元
SearchText API（v1） のみ
placeId が無効化された場合
再検索・再取得処理（SearchText）で常に最新化
placeId をスプレッドシートなどに保存
保存可。ただし長期キャッシュは禁止／更新前提で使用すること
APIの書き換えチェック
定期的に fieldMask の構造や仕様変更をチェックし、更新すること

# 🗺 Travel Plan Server

## 📌 概要
訪日外国人向けアニメ・マンガ旅行プラン自動生成サービスのバックエンド。

## 🗂 ディレクトリ構成

app/ ├── domains/spots/ # API/DB連携ロジック ├── scripts/ # GitHub Actions実行ファイル ├── utils/ # 汎用ツール（logger 等） test-scripts/ # ローカルテスト用


## 🧪 セットアップ手順
- Node.js v20 以上
- `.env` に以下を定義：

```env
APP_ENV=dev
GOOGLE_API_KEY_DEV=...
DEESEEK_API_KEY_DEV=...
SPREADSHEET_ID_SPOTS=...
📘 API・運用方針
Google Places API → v1 のみ使用（旧版禁止）

DeepSeek API → deepseek-chat 使用、OpenAI互換

🪵 ログ設計
app/utils/logger.js にて日本時間 / context 付きで出力

レベル：INFO / ERROR / DEBUG 対応

🪜 Step進行表（最新版：v1.6.3）

Step	内容	状況
Step 6	GitHub Actions構築	✅ 完了
Step 7	DeepSeek補完実装	✅ 完了
Step 8	description 上書き保存	✅ 完了
Step 9	status制御（次ステップ）	⏳ 開始予定

## v1.6.12-batch-keywords

- 🔄 目的：未完了スポットのキーワードステータスを一括で「完了済み（done）」に更新
- 🧪 テスト済み：`test-updateKeywordStatus.js`
- 📁 主要ファイル：
  - `app/scripts/batchCompleteReadySpots.js`
  - `app/domains/spots/updateKeywordStatus.js`
- 📝 補足：Google Sheets との連携前の内部処理用。今後、検索ログと統合予定。

## 📦 環境変数の準備

1. `.env.test.example` を参考に `.env` を作成してください：

```bash
cp .env.test.example .env

---

## ✅ まとめ

| ファイル名             | 配置場所       | Git管理 |
|------------------------|----------------|----------|
| `.env`                 | プロジェクトルート | ❌ 除外する（個人／Secrets管理） |
| `.env.test.example`    | プロジェクトルート | ✅ 含める（テンプレ配布用） |
| `.env.production`（任意） | プロジェクトルート or Secretsのみ | ❌ or GitHub Secrets |

---

必要であれば `.env.test.example` の**生成スクリプト**や、  
`.env` との差分チェックスクリプト（漏れ検知）もすぐご用意できます！

次に進めたい内容があればどうぞ🔥📘

## ✅ v1.1.1 以降の仕様変更

- すべてのNode.jsスクリプトを `.js` → `.mjs` に完全移行
- `import / export` を使用するES Modules構成
- 日本時間ログ出力付きの `logger.mjs` を全スクリプトに統一導入
- ログは `logs/update.log` に保存（`.gitignore` 対象）
- `.env` はローカル開発専用、GitHub Actions 本番は Secrets 運用
- `app/weather-write-to-sheet.mjs` を中心に天気データを取得・通知

# 📘 プロジェクト概要

このリポジトリは、訪日外国人向けのアニメ・マンガ旅行ガイドWebサービスを開発するためのものです。Google Places API（New版）を中心に、スポット情報の収集・補完・保存・表示を自動化し、旅行プランの最適化とユーザー体験の向上を目指しています。

---

# 🗂 ディレクトリ構成

（2025年4月28日時点 最新版）

```
app/
├── api/
├── data/
├── domains/
├── logs/
├── node_modules/（略）
├── public/
├── routes/
├── scripts/
├── sheets/
├── test/
├── tools/
├── utils/
├── views/
├── .gitignore
├── config.mjs
├── credentials.dev.json
├── credentials.prod.json
├── package.json
├── package-lock.json
├── server.mjs
├── test-index.html
├── vitest.config.mts
└── weather-write-to-sheet.mjs
```

※ 詳細な構成は `app-structure.txt` を参照してください。

---

# 🧪 セットアップ手順

### 必須インストール

- Node.js v20.x
- npm v10.x

### セットアップコマンド

```bash
npm install
```

### 環境変数設定

`.env` ファイルをルートに配置し、以下の変数を設定してください（順序：PROD→DEV）

例：
```bash
APP_ENV=dev
GOOGLE_API_KEY_DEV=xxxxxxx
GOOGLE_API_KEY_PROD=xxxxxxx
SHEET_ID_SPOTS_DEV=xxxxxxx
SHEET_ID_SPOTS_PROD=xxxxxxx
```

※ テンプレートは `.env.test.example` を複製してください。

---

# 📘 使用APIと運用ルール

- **Places API（New版）SearchText/Detailsのみ使用**
- **非採用API**：place/details/json（旧版）および非公式placeId取得は禁止
- **DeepSeek**：スポット情報補完用
- **OpenWeather API**：天気予報バッチ保存用（天気サービス連携予定）

**運用設計ルール**：
- placeId取得元は必ずSearchText経由
- types[]→categoryは`category-map.json`で変換
- tags_jsonは検索UIフィルター前提で保存

---

# 🪵 ログ出力・エラーハンドリング

- 全モジュールは `utils/logger.mjs` を通してログ記録
- JST時刻、レベル（info, warn, error）、コンテキスト情報付き
- ログは `logs/update.log` に出力され、デバッグ／トレーサビリティ確保

---

# 🪜 Step進行表

| ステップ | 内容 |
|:---|:---|
| Step 15 | GitHub Actionsによる定期バッチ（スポット補完＋天気保存）本番運用開始 |
| Step 16 | ステータス（done/failed/skipped）正確反映による冪等性確保 |
| Step 17 | DeepSeek補完対象拡張（best_time, tags_json, ai_description_status） |
| Step 18 | 地理・言語情報強化（region_tag, nearest_station, tags_ja一括取得＋マップ連携） |
| Step 19 | 地域別ピン色分け＋検索フィルター強化（UX改善） |

---

# 🛡 更新ルールとGit運用

- API仕様変更、.env構成変更、ログ設計変更時は必ず `README.md` を更新する
- 更新後のGit操作：

```bash
git add README.md
git commit -m "📘 README更新: 運用方針を追記"
git push origin main
```

- 節目ではタグ付与推奨：

```bash
git tag v1.6.15-readme-update
git push origin v1.6.15-readme-update

---

## 🪜 開発ステップ進行表（v1系）

| フェーズ | バージョン | 内容 | 状態 |
|----------|------------|------|------|
| Phase 0  | v1.0.0     | Google Sheets API + OpenWeather API の自動記録バッチ処理 | ✅ 完了 |
| Phase 1  | v1.1.0     | ロードマップ整理 / スプレッドシート構成整理 / API鍵管理 | ✅ 完了 |
| Phase 2  | v1.1.1     | 駅すぱあとAPI方針決定（後半へ移行） | ✅ 完了 |
| Phase 3  | v1.2.0     | 地図表示（Google Maps JavaScript API / test-map.html） | ✅ 完了 |
| Phase 4  | v1.3.0     | 検索ログ保存API＋為替表示＋構成再整理 | ✅ 完了（v1.3.0-restore） |
| Phase 5  | v1.4.0     | Nearby Search バッチ処理とスポットDB整理 | ⏳ 実装予定 |
| Phase 6  | v1.5.0     | 検索ログ学習・提案UI（OpenAI API 連携） | ⏳ 実装予定 |
| Phase 7  | v1.6.0     | 駅すぱあとAPI連携（徒歩＋鉄道ルート対応） | ⏳ 実装予定 |
| Phase 8  | v1.7.0     | UI・多言語化・翻訳 / i18n 対応 | ⏳ 実装予定 |
| Phase 9  | v1.8.0     | 公開用本番デプロイ・Railway構築・最終タグ付け | ⏳ 実装予定 |

---

📌 各フェーズは、実装→テスト→GitHubタグで管理  
✅ 完了済み / ⏳ 未着手 / 🔧 開発中 の3段階で進捗を明示

📌 プロジェクト概要 に「アニメ聖地スポットの管理と天気記録、自動バッチ処理を行うNode.jsアプリ」と明記
📘 使用API に「Places API v1 / OpenWeather / Sheets API / OpenAI / DeepSeek」など列挙
.env.testの構造、APP_ENVによる切り替えルール、logger設計を明記
Step進行表は Spot Data Summary の内容をそのまま引用

🪜 開発ステップ（v1.7.1まで）

バージョン	内容
v1.6.x	logger統一 / DeepSeek補完 / バッチ実装 / Spot保存構造整備
v1.7.0	相対パス統一・プロジェクト構成見直し・tools導入
✅ v1.7.1	project-knowledge.json 生成、/api/project-status 検索API実装