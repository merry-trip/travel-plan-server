# 最終更新日：2025/04/30

## config.mjs

APP_ENV（dev / prod / test）に応じて設定を切り替える中心ファイル。
.env から環境変数を読み込み、Google Sheets や APIキー、Gmail送信先などを一括管理する。
必要な設定が不足していれば起動時にエラーを出す。
他のファイルでは `import config from '../config.mjs'` で使う。

## app/scripts/batchWriteSpots.mjs

スポット情報の一括補完・保存処理を実行するバッチスクリプト。
内部では completeSpotInfo() を呼び出し、スポットデータを取得→補完→保存する流れをまとめて実行する。

APP_ENV=test の場合は実行されないよう制御されており、安全な運用が可能。
エラー発生時はログ出力のうえで process.exit(1) により失敗終了。
実行開始・完了・件数が logger によって詳細に記録される。

## app/utils/appendRows.mjs

Google Sheets に複数行（2次元配列）を追記する処理を行う関数。
getAuthClient() を通じて認証後、Sheets API v4 を使って書き込みを実行する。

追記対象のシート名は引数で指定され、範囲は A1 ベースで自動追加される。
valueInputOption: 'USER_ENTERED' により、手入力と同じ形式で書き込まれる。
成功時にはログに件数とシート名が記録される。

## app/utils/logger.mjs

INFO/WARN/ERROR などのログを標準出力と logs/ フォルダに記録する共通ユーティリティ。
ファイルは日ごとに分割され、最大7日分を gzip 圧縮して保存。
全ファイル共通で logInfo(), logError() などの関数を使う設計。
タイムゾーンは日本時間（Asia/Tokyo）。

## app/domains/spots/categorizeSpot.mjs

Google Places API の `types` を元に、カテゴリ分類（category_for_map）およびタグ配列（tags_json）を生成する処理。

内部では `category-map.json` を参照し、types にマッチした keyword をもとに category を付与する。
- getCategoriesFromTypes()：tags_json 用に複数カテゴリを返す
- getPrimaryCategory()：最初に一致したカテゴリ（category_for_map）を返す

category-map.json の更新により、分類ルールの柔軟な変更が可能。

## app/domains/spots/columnOrder.mjs

スプレッドシートへの出力列の順序を定義する配列。
mapSpotToRow() や writeSpot() など、スプレッドシート書き込み時の整形処理で使用される。

列の追加・削除・並び順の変更は必ずこのファイルで管理することで、整合性を保つ仕組み。
各ブロックは用途別に整理されており、将来的な拡張にも対応しやすい構造になっている。

## app/domains/spots/completeFullSpotInfo.mjs

スポット補完処理の中核。キーワードを受け取り、Google検索（SearchText）で placeId を取得し、
詳細情報・AI補完・カテゴリ分類・地域タグを追加したうえでスプレッドシートに1行保存する。

主な処理順：
1. searchTextSpot → placeId取得
2. enrichSpotDetails → 住所・営業時間など追加
3. completeWithDeepSeek → 説明文などAI生成
4. categorizeSpot / getRegionTagByLatLng → 補完
5. writeSpot で保存 → updateSpotStatus('done')

すでに登録済みの場合はスキップ。
logger で処理ログを記録。

## app/domains/spots/completeSpotInfo.mjs

1スポットの情報を検索・補完・スプレッドシートに書き込む簡易処理。
検索ワードから placeId を取得し（SearchText API）、
その placeId に対して enrichSpotDetails() で詳細補完を行い、
最終的に writeSpot() で保存する。

成功/失敗に応じて success フラグとエラーメッセージを返す。
主にバッチ処理やテストで1件ずつ処理したいときに使用。

## app/domains/spots/completeWithDeepSeek.mjs

DeepSeek API を使って、スポットに対する英語の説明文（description）と旅行ヒント（short_tip_en）を自動生成する処理。

プロンプトにはスポット名やカテゴリを埋め込み、Chat形式でPOSTする。
レスポンスから2つのフィールドを抽出して元のスポットに追加し、
ai_description_status を 'done' または 'failed' に設定する。

失敗しても処理全体は落とさず、ログにエラーを記録して返却する設計。

## app/domains/spots/enrichSpotDetails.mjs

Google Places API の GetPlaceDetails を使って、placeId から詳細なスポット情報を取得・補完する処理。
取得するフィールドには rating, address, opening_hours, website, phone などが含まれ、スポットデータに追記される。

補完後は元のスポットデータとマージして返す。
APIエラー時にはログを出力し、throw で呼び出し元に通知する。
主に completeFullSpotInfo や completeSpotInfo から呼び出される。

## app/domains/spots/getRegionTagByLatLng.mjs

スポットの緯度・経度から地域タグ（region_tag）を判定する処理。
region_map_by_bounds.json に定義された地域ごとの緯度経度範囲に基づいて、
一致する地域名（例: 'tokyo'）を返す。

一致しない場合は空文字を返す。
エラー発生時もログを出力し、空文字でフォールバックする設計。

## app/domains/spots/rowMapper.mjs

スポットオブジェクトをスプレッドシート1行分の配列に変換する関数。
列順は columnOrder.mjs に完全準拠しており、書き込み時の整合性を保証する。

- 配列はカンマ区切り文字列に変換
- オブジェクトは JSON.stringify で文字列化
- 欠けている項目は空文字にし、logInfo で警告を出す

## app/domains/spots/searchTextSpot.mjs

Google Places API の SearchText を使い、検索キーワードからスポット情報を取得する処理。
内部では POST リクエストを投げ、最初にヒットしたスポット1件を返す。

取得データには placeId, name, 座標, address, types などが含まれる。
入力キーワードとスポット名が一致しない場合は警告ログを出す。

戻り値はスポットオブジェクト or null。
エラー時は logger に出力のうえ throw。

## app/domains/spots/updateSpotStatus.mjs

placeId をもとにスプレッドシートの該当行を探し、
- status 列を更新（例：done, error）
- last_updated_at 列を今日の日付に更新
status が ready のときだけ書き込むルールは、他ファイルで制御される。
logger によりログが update.log に出力される（レベル：INFO / WARN / ERROR、JST時刻付き）

## app/domains/spots/validateSpot.mjs

スポットデータの構造チェックを行う関数。
placeId, name, lat, lng の4つが存在しているか、
型（string または number）が正しいかを検証する。

不正な場合は throw して処理を止める。  
logError / logInfo によってログにも結果を記録する。

writeSpot や completeFullSpotInfo の中で使われている。

## app/domains/spots/writeSpot.mjs

スポットデータ1件をスプレッドシートに書き込む関数。
書き込み前に以下を実施：
1. validateSpot() で形式をチェック
2. mapSpotToRow() で列順に整形
3. appendRow() で書き込み
書き込んだ内容は logInfo によりログに記録される。
status や placeId も記録して後で追跡できるようになっている。

## app/domains/spots/writeSpots.mjs

複数のスポットデータをバリデーション・整形し、スプレッドシートに一括保存する関数。
内部では validateSpot() による形式チェックと、mapSpotToRow() による列順変換を行う。

書き込みは appendRows() を通じてまとめて実行される。
不正なデータはスキップされ、logger で失敗内容・件数・対象名を記録する。

戻り値として成功件数・失敗件数・失敗ラベルも返す。
