# 📘 Project Knowledge 一覧（自動生成）

バージョン: `v1.7.0` / 最終更新: `2025-04-30T12:40:06.933Z`

| No | Category | Path | Description |
|----|----------|------|-------------|
| 1 | api | `app/api/forecast.mjs` | 緯度・経度を指定して OpenWeather API から5日間3時間ごとの天気予報を取得するAPI処理 |
| 2 | api | `app/api/get-spots.mjs` | Google Sheets（anime_spot_db）からスポット一覧を取得し、整形して返すAPI処理。取得項目には緯度・経度・placeId・説明などが含まれ、取得件数と先頭行のログ出力も行う。 |
| 3 | api | `app/api/log-search.mjs` | 検索条件（search_params）と為替情報をまとめてスプレッドシートに記録するAPI処理。JSTタイムスタンプ付きでログ行を追加し、Google Sheets APIを用いてログ専用シートに追記する。 |
| 4 | api | `app/api/project-status.mjs` | project-knowledge.json を読み込み、queryに応じたファイル情報を返す検索用API |
| 5 | api | `app/api/send-mail.mjs` | Gmailアカウントを使って指定された件名と本文のメールを送信するユーティリティ関数。nodemailerを用いてGmail認証を行い、処理状況をログに記録する。 |
| 6 | api | `app/api/sheets.mjs` | 天気ログ用スプレッドシートのデータ操作用API処理。既存データ行（A2以降）の一括削除と、新たな天気データ行の追記に対応し、環境別認証方式にも柔軟に対応する。 |
| 7 | test | `app/api/test-autocomplete.mjs` | Google Places API（Autocomplete）にキーワードを POST し、補完候補を取得してログ出力するテストスクリプト。X-Goog-FieldMask に * を指定してすべてのフィールドを取得する。 |
| 8 | test | `app/api/test-getPlaceDetails.mjs` | Google Places API（GetPlaceDetails）を使って、placeId に対応するスポットの詳細情報を取得・出力するテストスクリプト。フィールドマスクは * を使用。 |
| 9 | test | `app/api/test-nearbySearch.mjs` | Google Places API（NearbySearch）に対し、指定地点・半径・type を指定して観光スポットを検索するテストスクリプト。最大3件の結果を取得してログ出力する。 |
| 10 | test | `app/api/test-routes.mjs` | Google Maps Routes API（v2）を使い、新宿駅から池袋駅への公共交通ルートを取得するテストスクリプト。単位や国コードを自動検出し、リクエスト条件に反映する。 |
| 11 | test | `app/api/test-searchText.mjs` | Google Places API（SearchText）に 'Nintendo TOKYO' を送信し、上位3件のスポット情報を取得してログに出力するテストスクリプト。 |
| 12 | domains | `app/domains/keywords/updateKeywordStatus.mjs` | 指定されたキーワードに対応する行の status セルを更新する処理。SHEET_NAME_KEYWORDS 上の 'keyword' 列をもとに対象行を検索し、status を 'done' や 'failed' などに更新する。 |
| 13 | domains | `app/domains/spots/batchCompleteFullSpots.mjs` | スプレッドシートからキーワード一覧を取得し、completeFullSpotInfo を使って全件補完を試みるバッチ処理。成功・失敗の件数をログに記録する。 |
| 14 | domains | `app/domains/spots/categorizeSpot.mjs` | Google Places API の types 配列に基づいて、スポットのカテゴリ（category_for_map）とタグ配列（tags_json）を分類・抽出する処理。category-map.json を参照。 |
| 15 | domains | `app/domains/spots/columnOrder.mjs` | スプレッドシート出力時に使用する列順を定義した配列。writeSpot や mapSpotToRow によって参照され、列の整合性を維持するための共通基準となる。 |
| 16 | domains | `app/domains/spots/completeFullSpotInfo.mjs` | スポット補完の統合処理。検索キーワードから placeId を取得し、DeepSeek による説明文生成、カテゴリ分類、地域タグ付与を行った上でスプレッドシートに保存する。処理結果に応じてステータス更新も行う。 |
| 17 | domains | `app/domains/spots/completeSpotInfo.mjs` | 指定文字列からスポット情報を検索・補完し、スプレッドシートに書き込む簡易処理。SearchText API, PlaceDetails API を順に呼び出し、placeId が得られれば書き込みまで行う。 |
| 18 | domains | `app/domains/spots/completeWithDeepSeek.mjs` | DeepSeek API を用いてアニメスポットの英語説明文と旅行ヒント（short_tip_en）を自動生成する補完処理 |
| 19 | domains | `app/domains/spots/enrichSpotDetails.mjs` | Google Places API (New) を用いて、placeId をもとにスポット情報を詳細補完する処理。評価・営業時間・住所・URL・説明文などを取得し、元の spot オブジェクトに追記して返却する。 |
| 20 | domains | `app/domains/spots/fieldsToUpdate.mjs` | レビューや営業情報の更新時に対象とするフィールド（rating, ratings_count, open_now, opening_hours）を定義した配列。更新系スクリプトで使用される。 |
| 21 | domains | `app/domains/spots/getBasicPlaceDetails.mjs` | Google Places API から rating / ratings_count / open_now / opening_hours を取得し、スポットの基本情報として返す処理。APIのレスポンスをシンプルに整形する。 |
| 22 | domains | `app/domains/spots/getKeywordsFromSheet.mjs` | キーワード用スプレッドシートから status=ready の行を抽出し、キーワードリストとして返す処理。rowIndexも含めて返却し、補完処理などに使用する。 |
| 23 | domains | `app/domains/spots/getRegionTagByLatLng.mjs` | 緯度・経度をもとに定義済みの地域境界リストから地域タグ（region_tag）を判定する処理。該当範囲がない場合は空文字を返す。 |
| 24 | domains | `app/domains/spots/rowMapper.mjs` | スポットオブジェクトをスプレッドシート1行分の配列に変換する関数。出力順は columnOrder.mjs に準拠し、整合性を担保する。 |
| 25 | domains | `app/domains/spots/searchTextSpot.mjs` | Google Places API（SearchText）を使ってキーワードからスポット情報を検索し、placeId・名前・住所・位置情報・types を取得する処理。最初のヒットのみを返す。 |
| 26 | domains | `app/domains/spots/updateSpotDetails.mjs` | 既存のスポット行（placeId一致）に対して、description / tip / ai_description_status などの補完項目をスプレッドシート上に上書き保存する処理。 |
| 27 | domains | `app/domains/spots/updateSpotRow.mjs` | SpotDB におけるplaceId指定の汎用更新処理。必要なフィールドのみを上書きするためのユーティリティで、updateSheetRow を内部的に利用している。 |
| 28 | domains | `app/domains/spots/updateSpotStatus.mjs` | スプレッドシート上のスポット行を placeId で特定し、status と last_updated_at の列を更新する処理 |
| 29 | domains | `app/domains/spots/validateSpot.mjs` | スポットオブジェクトに対して、必須フィールド（placeId・name・lat・lng）の存在と型を検証する処理。問題があればエラーをスローし、通過すれば true を返す。 |
| 30 | domains | `app/domains/spots/writeSpot.mjs` | スポットオブジェクトをバリデーション後、1行のスプレッドシートデータとして変換し、appendRow によりシートへ追加する処理。ログ記録も含む。 |
| 31 | domains | `app/domains/spots/writeSpots.mjs` | 複数のスポットオブジェクトを一括でバリデーション・変換し、スプレッドシートに一括追加する処理。無効なデータはスキップし、ログ出力で記録する。 |
| 32 | domains | `app/domains/weather/fetchForecast.mjs` | OpenWeather API を使って、指定された緯度・経度に対する5日間（3時間ごと）の天気予報データを取得する処理。取得結果はオリジナルのAPIレスポンス形式で返す。 |
| 33 | domains | `app/domains/weather/sendMail.mjs` | Gmailアカウントを使って通知メールを送信する処理。件名と本文を受け取り、nodemailerを用いて送信を行う。天気処理の成功・失敗通知で使用される。 |
| 34 | domains | `app/domains/weather/sheetsWeather.mjs` | 天気ログ用スプレッドシートの操作に関する処理群。A2以降の既存データ削除と、取得済み天気データの追記を提供する。Google Sheets API を使用。 |
| 35 | domains | `app/domains/weather/writeToSheet.mjs` | 東京の天気予報を OpenWeather API から取得し、スプレッドシートに追記する一連の処理。前処理で既存行を削除し、完了後に Gmail で通知メールを送信する。 |
| 36 | routes | `app/routes/log-search.mjs` | POSTリクエスト `/api/log-search` を受け取り、検索ログをスプレッドシートに記録するAPI（logSearch）を実行するExpressルーティング定義。 |
| 37 | scripts | `app/scripts/batchCompleteReadySpots.mjs` | スプレッドシートから status=ready のキーワードを抽出し、それぞれに対してスポット補完処理（completeFullSpotInfo）を実行するCLIバッチスクリプト。 |
| 38 | scripts | `app/scripts/batchWriteSpots.mjs` | completeSpotInfo を使ってスポット情報を取得・補完し、スプレッドシートに書き込む簡易バッチ処理スクリプト。APP_ENV=test 時は実行されない。 |
| 39 | scripts | `app/scripts/run-batchCompleteFullSpots.mjs` | domains/spots/batchCompleteFullSpots を起動するだけの実行用スクリプト。本番・開発環境でのみ実行される設計。 |
| 40 | test | `app/scripts/test-env.mjs` | .env ファイルの読み込みと、GOOGLE_APPLICATION_CREDENTIALS が存在するかを確認するテストスクリプト。環境構成の確認に使用。 |
| 41 | test | `app/scripts/test-searchText-types.mjs` | SearchText API を使って複数のクエリを実行し、返ってくる types を集計するスクリプト。スポット分類設計の参考用に types 一覧を収集。 |
| 42 | test | `app/scripts/test-sheet-get.mjs` | getAuthClient() の動作確認用スクリプト。Google Sheets API 認証が正しく行えるか、CLI実行でテストする。 |
| 43 | scripts | `app/scripts/updateRatingsBatch.mjs` | 全スポットの placeId に対して getBasicPlaceDetails を実行し、rating や open_now などの更新対象フィールドをスプレッドシートに反映するバッチ処理。 |
| 44 | scripts | `app/scripts/weather-write-to-sheet.mjs` | OpenWeather API で東京の天気予報を取得し、スプレッドシートに記録した上で、処理結果を Gmail 通知するバッチ処理 |
| 45 | scripts | `app/scripts/writeWithDeepSeek.mjs` | スプレッドシートから取得したキーワードに対し DeepSeek API を使って説明文と旅行ヒントを補完し、スポット情報に保存するバッチ処理 |
| 46 | test | `app/test/unit/batchCompleteFullSpots.test.mjs` | batchCompleteFullSpots 関数のログ出力と動作を確認するユニットテスト。logInfo が複数回呼び出され、補完バッチが正常に進行することを検証する。 |
| 47 | test | `app/test/unit/batchCompleteReadySpots.test.mjs` | runBatchComplete バッチ関数が例外なく完了し、成功・失敗・失敗キーワード情報を含む結果オブジェクトが返ることを検証する。 |
| 48 | test | `app/test/unit/batchwritespots.test.mjs` | batch-write-spots.mjs スクリプトが例外なく import → 実行されることを確認するテスト。起動エラーの検知を目的とする。 |
| 49 | test | `app/test/unit/categorizeSpot.test.mjs` | getPrimaryCategory および getCategoriesFromTypes のカテゴリ分類ロジックを types 配列ごとに検証するユニットテスト。 |
| 50 | test | `app/test/unit/completeFullSpotInfo.test.mjs` | completeFullSpotInfo 関数が指定キーワードに対して補完処理を行い、status='done' または 'failed' を含む結果を返すことを検証するユニットテスト。 |
| 51 | test | `app/test/unit/completeSpotInfo.test.mjs` | completeSpotInfo 関数が指定キーワードに対して補完・保存を行い、placeId と name を含む結果を返すことを検証する。 |
| 52 | test | `app/test/unit/deepSeek.test.mjs` | completeWithDeepSeek により description, short_tip_en を補完し、ステータスに応じて updateSpotDetails を実行できるかを検証するユニットテスト。 |
| 53 | test | `app/test/unit/enrichSpotDetails.test.mjs` | enrichSpotDetails 関数が placeId をもとにスポット情報（name, lat, lngなど）を補完できることを確認するユニットテスト。 |
| 54 | test | `app/test/unit/logger.test.mjs` | logInfo / logError の出力が正しく行えるかを確認するユニットテスト。例外処理やログメッセージの記録も含む。 |
| 55 | test | `app/test/unit/searchTextSpot.test.mjs` | searchTextSpot 関数がキーワードに対してスポット検索を行い、結果として name / placeId を取得できるかを確認するユニットテスト。 |
| 56 | test | `app/test/unit/test-completeFullSpotInfo.test.mjs` | completeFullSpotInfo 関数が有効なキーワードで status='done' を返し、無効なキーワードで error や skipped を返すことを確認する正常系・異常系テスト。 |
| 57 | test | `app/test/unit/test-get-keywords.test.mjs` | getKeywordsFromSheet 関数が status=ready のキーワードを正しく抽出し、rowIndex / keyword を含むオブジェクト配列で返すことを確認するユニットテスト。 |
| 58 | test | `app/test/unit/test-getRegionTag.test.mjs` | 指定座標（秋葉原）から Google Geocoding API を使って sublocality_level_1 を取得し、region_tag として取得できるかを確認するテスト。 |
| 59 | test | `app/test/unit/test-updateKeywordStatus.test.mjs` | updateKeywordStatus 関数を使用して、指定したキーワードのステータスを 'done' に正常更新できることを検証するユニットテスト。 |
| 60 | test | `app/test/unit/writeSpot.test.mjs` | writeSpot 関数を使って、テスト用スポット情報をスプレッドシートに正常に書き込めることを検証するユニットテスト。 |
| 61 | test | `app/test/unit/writeSpots.test.mjs` | writeSpots 関数を使って、補完済みスポットデータを1件以上まとめて正常に書き込めることを確認するユニットテスト。 |
| 62 | test | `app/test/unit/writeWithDeepSeek.test.mjs` | writeWithDeepSeek.mjs スクリプトをインポートし、default関数を実行して例外なく処理が完了することを検証するバッチスクリプトのユニットテスト。 |
| 63 | test | `app/tools/archive/test-cmd.mjs` | Windows 環境で cmd.exe を使用したコマンド実行（echo）の動作確認を行うテストスクリプト。 |
| 64 | test | `app/tools/archive/test-getPlaceDetails.mjs` | Google Places API で取得した詳細データに対し、DeepSeek でレビュー要約とタグを生成し、スプレッドシートに書き込む統合検証スクリプト。 |
| 65 | test | `app/tools/archive/test-npm-list.mjs` | npm list --json コマンドを実行し、現在の依存関係一覧を標準出力に表示するテストスクリプト。 |
| 66 | test | `app/tools/archive/test-searchNearby.mjs` | Google Maps Places API（Nearby Search）を使って、秋葉原・池袋・中野周辺のスポット情報を取得し、未登録のものだけをスプレッドシートに保存するスクリプト。 |
| 67 | test | `app/tools/archive/test-searchText-v2.mjs` | 複数のアニメ関連クエリで SearchText API を実行し、取得スポット情報を重複確認後スプレッドシートに保存するバッチテストスクリプト。 |
| 68 | test | `app/tools/archive/test-searchText.mjs` | SearchText API を使って 'Animate Akihabara' を検索し、取得したスポット情報を JSON 出力する簡易テストスクリプト。 |
| 69 | tools | `app/tools/debug-path.mjs` | 環境変数 PATH を取得し、内容をファイルに出力してパス設定の確認を行うデバッグ用スクリプト。 |
| 70 | tools | `app/tools/update-category.mjs` | types 配列からカテゴリを自動判定し、スプレッドシート上のスポットにカテゴリ（列H）を書き込む一括更新スクリプト。 |
| 71 | tools | `app/tools/update-knowledge-json.mjs` | app/ 以下の .mjs ファイルを再帰的に走査し、path / category / description を含む project-knowledge.json を自動生成するスクリプト |
| 72 | tools | `app/tools/update-readme-modules.mjs` | npm list の出力から依存モジュール一覧を取得し、README.md の対応セクションを自動更新するドキュメント補助ツール。 |
| 73 | tools | `app/tools/update-structure-json.mjs` | .mjs や .json ファイルを再帰的に探索し、プロジェクト構造情報を project-structure.json に自動生成・保存するスクリプト。 |
| 74 | utils | `app/utils/appendRow.mjs` | 1行の配列データを指定シートに追記する処理。Google Sheets API v4 を使用し、ログ付きで記録。 |
| 75 | utils | `app/utils/appendRows.mjs` | 複数行の配列データをまとめて指定シートに追記する処理。appendRow のバルク処理版。 |
| 76 | utils | `app/utils/auth.mjs` | Google Sheets API 用のサービスアカウント認証クライアント（JWT）を作成し、認証済みの Sheets クライアントを返す共通処理 |
| 77 | utils | `app/utils/getStoredPlaceIds.mjs` | スプレッドシート上から全 placeId を取得し、配列として返す。重複チェックや存在判定に使用。 |
| 78 | utils | `app/utils/logger.mjs` | JST形式・ログレベル（INFO/ERROR等）別に標準出力とローテーションファイルに記録する共通ロガー。gzip圧縮・7日保持対応 |
| 79 | utils | `app/utils/sheets.mjs` | Google Sheets API の認証・クライアント生成・データ取得（全行オブジェクト配列化）を行う共通ユーティリティ。 |
| 80 | utils | `app/utils/updateSheetRow.mjs` | 指定された placeId に一致する行を探し、与えられたフィールドのみを上書き保存する処理。行単位の部分更新に対応。 |
