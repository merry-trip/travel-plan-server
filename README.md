# travel-plan-server

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

---
