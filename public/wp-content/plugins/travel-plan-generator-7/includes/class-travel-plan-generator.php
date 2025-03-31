<?php
class Travel_Plan_Generator {

    public function init() {
        // フロントエンドのスクリプトとスタイルを登録
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // AJAXハンドラの登録
        add_action('wp_ajax_tpg7_generate_plan', array($this, 'handle_generate_plan'));
        add_action('wp_ajax_nopriv_tpg7_generate_plan', array($this, 'handle_generate_plan'));
    }

    public function handle_generate_plan() {
        // セキュリティチェック
        check_ajax_referer('tpg7_nonce', '_ajax_nonce');

        // 入力データの取得とバリデーション
        $destination = sanitize_text_field($_POST['destination']);
        $dates = sanitize_text_field($_POST['dates']);
        $interests = sanitize_textarea_field($_POST['interests']);

        if (empty($destination) || empty($dates)) {
            wp_send_json_error('Required fields are missing');
            exit;
        }

        // デバッグログ
        error_log('Travel Plan Generator - Received request: ' . print_r($_POST, true));
        error_log('Travel Plan Generator - API Keys: ' . print_r(array(
            'openai' => defined('TPG7_OPENAI_API_KEY'),
            'google_maps' => defined('TPG7_GOOGLE_MAPS_API_KEY'),
            'openweather' => defined('TPG7_OPENWEATHER_API_KEY')
        ), true));

        // OpenWeather API呼び出し
        $weather_data = $this->get_weather_data($destination, $dates);
        if (is_wp_error($weather_data)) {
            wp_send_json_error($weather_data->get_error_message());
            wp_die();
        }

        // 初期レスポンスデータ
        $response = array(
            'destination' => $destination,
            'dates' => $dates,
            'interests' => $interests,
            'weather' => $weather_data,
            'route' => array(
                'distance' => '100km', // 後でGoogle Maps APIで置き換え
                'duration' => '2時間'
            ),
            'places' => array(
                array(
                    'name' => '観光スポット1', // 後でPlaces APIで置き換え
                    'type' => 'museum'
                )
            )
        );

        // すべての出力バッファをクリア
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // 明示的にContent-Typeを設定
        @header('Content-Type: application/json; charset=UTF-8');
        @header('X-Content-Type-Options: nosniff');
        @header('Access-Control-Allow-Origin: *');
        @header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        @header('Access-Control-Allow-Headers: Content-Type');

        // デバッグログに最終レスポンスを記録
        error_log('Final Response: ' . json_encode($response, JSON_UNESCAPED_UNICODE));

        // JSONレスポンスを返す
        wp_send_json_success($response);
        exit;
    }

    private function get_weather_data($destination, $dates) {
        // 日付を解析
        $date_range = explode('から', $dates);
        if (count($date_range) !== 2) {
            return new WP_Error('invalid_date_format', '日付の形式が正しくありません');
        }

        $start_date = strtotime(trim($date_range[0]));
        $end_date = strtotime(trim($date_range[1]));

        // OpenWeather API URL
        $api_url = 'https://api.openweathermap.org/data/2.5/forecast?q=' . urlencode($destination) . 
                   '&appid=' . TPG7_OPENWEATHER_API_KEY . '&units=metric&lang=ja';

        // APIリクエスト
        try {
            $response = wp_remote_get($api_url, array(
                'timeout' => 30,
                'sslverify' => false,
                'headers' => array(
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                )
            ));

            if (is_wp_error($response)) {
                $error_message = 'OpenWeather API Request Error: ' . $response->get_error_message();
                error_log($error_message);
                return new WP_Error('api_request_failed', $error_message);
            }

            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code !== 200) {
                $error_message = 'OpenWeather API Error - Response Code: ' . $response_code;
                error_log($error_message);
                return new WP_Error('api_error', $error_message);
            }

            // レスポンスヘッダーの確認
            $response_headers = wp_remote_retrieve_headers($response);
            error_log('OpenWeather API Response Headers: ' . print_r($response_headers, true));

            $body = wp_remote_retrieve_body($response);
            error_log('OpenWeather API Raw Response: ' . $body);

            // レスポンスボディのバリデーション
            if (empty($body)) {
                error_log('OpenWeather API Error: Empty response body');
                return new WP_Error('empty_response', 'API response is empty');
            }

            // JSONデコード前にエスケープ文字を削除
            $body = stripslashes($body);
            $data = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $json_error = 'OpenWeather API JSON Decode Error: ' . json_last_error_msg();
                error_log($json_error);
                error_log('Raw Response Body: ' . $body);
                return new WP_Error('json_decode_error', $json_error);
            }

            if (empty($data['list'])) {
                return new WP_Error('weather_api_error', '天気データを取得できませんでした');
            }

            // 指定期間内の天気データをフィルタリング
            $filtered_weather = array();
            foreach ($data['list'] as $forecast) {
                $dt = $forecast['dt'];
                if ($dt >= $start_date && $dt <= $end_date) {
                    $filtered_weather[] = array(
                        'datetime' => date('Y-m-d H:i', $dt),
                        'temp' => $forecast['main']['temp'],
                        'description' => $forecast['weather'][0]['description'],
                        'icon' => $forecast['weather'][0]['icon']
                    );
                }
            }

            return $filtered_weather;
        } catch (Exception $e) {
            error_log('OpenWeather API Exception: ' . $e->getMessage());
            return new WP_Error('api_exception', 'API処理中に例外が発生しました: ' . $e->getMessage());
        }
    }

    public static function render_form() {
        ob_start();
        ?>
        <div id="tpg7-form-container">
            <form id="tpg7-travel-form" method="post">
                <div class="form-group">
                    <label for="tpg7-destination">目的地:</label>
                    <input type="text" id="tpg7-destination" name="destination" required>
                </div>

                <div class="form-group">
                    <label for="tpg7-dates">旅行期間:</label>
                    <input type="text" id="tpg7-dates" name="dates" required>
                </div>

                <div class="form-group">
                    <label for="tpg7-interests">興味のある活動:</label>
                    <textarea id="tpg7-interests" name="interests"></textarea>
                </div>

                <button type="submit" id="tpg7-submit">プラン生成</button>
            </form>

            <div id="tpg7-results" style="margin-top: 20px;"></div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            'tpg7-main',
            plugins_url('assets/js/travel-plan-generator.js', dirname(__FILE__)),
            array('jquery'),
            '1.0.0',
            true
        );

        wp_localize_script('tpg7-main', 'tpg7_vars', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('tpg7_nonce')
        ));
    }
}
