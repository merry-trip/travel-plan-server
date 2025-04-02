<?php
/*
Plugin Name: 旅行プラン入力フォーム（デザイン修正版）
Description: ユーザーが旅行条件を入力→結果を同一ページで表示する。結果画面でのボタンデザインをプロ目線で美しく配置。
Version: 2.0
Author: Your Name
*/

if ( ! defined( 'ABSPATH' ) ) exit;

function travel_plan_form_shortcode() {
    
    $is_submitted = isset($_POST['generate_plan']);

    ob_start(); 
    ?>
    <style>
    .travel-plan-container {
        max-width: 600px;
        margin: 20px auto;
        font-family: sans-serif;
    }
    .top-notice {
        font-size: 14px;
        color: #333;
        text-align: center;
        margin-bottom: 10px;
        line-height: 1.4;
    }
    .travel-plan-form {
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #fff;
        padding: 15px;
    }
    .travel-plan-form h3 {
        text-align: center;
        margin-top: 0;
    }
    .travel-plan-form label {
        display: block;
        margin-top: 10px;
        font-weight: bold;
    }
    .travel-plan-form input[type="text"],
    .travel-plan-form input[type="number"],
    .travel-plan-form select {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        box-sizing: border-box;
    }
    .button-wrapper {
        text-align: center;
        margin-top: 15px;
    }
    .travel-plan-form button {
        padding: 14px 28px;
        background: #0073aa;
        color: #fff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
    }
    .travel-plan-form button:hover {
        background: #005f8d;
    }
    .notice-text {
        font-size: 10px;
        color: #666;
        text-align: center;
        margin-top: 4px;
    }
    /* 結果表示部分 */
    .travel-plan-output {
        border: 1px solid #0073aa;
        border-radius: 5px;
        background: #f0f8ff;
        padding: 15px;
        margin-top: 20px;
        white-space: pre-wrap;
        line-height: 1.6;
    }
    .ai-notice {
        font-size: 10px;
        color: #666;
        text-align: center;
        margin-top: 10px;
        line-height: 1.4;
    }
    /* コピー、戻る、LINEボタン */
    .copy-button {
        display: inline-block;
        margin-top: 10px;
        padding: 10px 20px;
        background: #666;
        color: #fff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
    }
    .copy-button:hover {
        background: #444;
    }
    .return-link,
    .affiliate-button {
        display: inline-block;
        margin-top: 30px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        color: #fff;
        width: 200px;
        text-align: center;
        margin-bottom: 10px; 
    }
    .return-link {
        background: #0073aa;
        margin-right: 10px;
    }
    .return-link:hover {
        background: #005f8d;
        color: #fff;
    }
    .affiliate-button {
        background: #00c300; /* LINEのグリーン */
    }
    .affiliate-button:hover {
        background: #00c300;
        color: #fff;
    }
    /* 3つのボタン（じゃらん、楽天トラベル、Agoda）をデザイン */
    .extra-links {
        display: flex;
        flex-direction: column;
        align-items: center; 
        gap: 15px;           /* ボタン同士の間隔 */
        margin-top: 50px;    /* 上部余白 */
    }
    .extra-links a {
        text-decoration: none;
        width: 250px;
        padding: 15px 25px;
        border-radius: 30px;        /* ピル型に丸みを付ける */
        color: #fff;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .extra-links a:hover {
        color: #fff; 
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(0,0,0,0.3);
    }
    .jaran {
        background: #FF9900; /* じゃらん */
    }
    .rakuten {
        background: #02BA02; /* 楽天トラベル */
    }
    .agoda {
        background: #FF2938; /* Agoda */
    }
    .button-row {
  display: flex;            /* 横並びにする */
  justify-content: center;  /* 中央寄せ */
  align-items: center;      /* ボタンの高さを揃える */
  gap: 10px;                /* ボタン同士の隙間を10pxにする */
  margin-top: 30px; /* 「コピー」ボタンとの間を30px */
}
/* もし .return-link や .affiliate-button に width: 200px; がある場合は削除 */
.return-link,
.affiliate-button {
  width: auto;  /* 幅を自動にする */
  margin: 0;    /* 個別の余白をリセット */
}

    </style>
    <?php

    if ( ! $is_submitted ) {
        ?>
        <div id="form-section" class="travel-plan-container">
    <div class="top-notice">
        このページは、1日最大3回までアクセス可能です。<br>
        回数の上限に達した場合は、翌日に再度ご利用ください。
    </div>
    <form method="post" class="travel-plan-form" id="travel-plan-form">
        <h3>旅行プラン入力フォーム</h3>
        <!-- 以降、入力項目 -->

                <label for="departure">出発地 (必須)</label>
                <input type="text" id="departure" name="departure" required placeholder="例：大阪">

                <label for="destination">旅行先 (必須)</label>
                <input type="text" id="destination" name="destination" required placeholder="例：東京">

                <label for="season">旅行の時期</label>
                <input type="text" id="season" name="season" placeholder="例：夏">

                <label for="purpose">旅行の目的</label>
                <input type="text" id="purpose" name="purpose" placeholder="例：観光、記念日">

                <label for="days">旅行日数 (必須)</label>
                <input type="number" id="days" name="days" required min="1" placeholder="例：3">

                <label for="people">旅行人数 (必須)</label>
                <input type="number" id="people" name="people" required min="1" placeholder="例：2">

                <label for="budget">旅行予算</label>
                <input type="text" id="budget" name="budget" placeholder="例：50000円">

                <label for="interests">やりたいこと・体験</label>
                <input type="text" id="interests" name="interests" placeholder="例：温泉、グルメ">

                <label for="specific_places">絶対に行きたい場所</label>
                <input type="text" id="specific_places" name="specific_places" placeholder="例：東京タワー">

                <label for="transport">移動手段</label>
                <select id="transport" name="transport">
                    <option value="">選択しない</option>
                    <option value="車">車</option>
                    <option value="電車">電車</option>
                    <option value="飛行機">飛行機</option>
                </select>

                <label for="accommodation">宿泊の希望</label>
                <input type="text" id="accommodation" name="accommodation" placeholder="例：ホテル、旅館">

                <label for="food">食事のこだわり</label>
                <input type="text" id="food" name="food" placeholder="例：和食、洋食">

                <input type="hidden" name="generate_plan" value="1">

                <div class="button-wrapper">
                    <button type="submit" id="plan-button">プランをみる！</button>
                    <p class="notice-text">※作成には30秒ほどかかります</p>
                </div>
            </form>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function(){
            var form = document.getElementById('travel-plan-form');
            // Enterキーでの送信を防止
            form.addEventListener('keydown', function(e){
                if(e.key === 'Enter'){
                    e.preventDefault();
                }
            });
        });
        </script>
        <?php
    } else {
        // フォーム送信後の処理
        $departure       = sanitize_text_field($_POST['departure']);
        $destination     = sanitize_text_field($_POST['destination']);
        $season          = sanitize_text_field($_POST['season']);
        $purpose         = sanitize_text_field($_POST['purpose']);
        $days            = intval($_POST['days']);
        $people          = intval($_POST['people']);
        $budget          = sanitize_text_field($_POST['budget']);
        $interests       = sanitize_text_field($_POST['interests']);
        $specific_places = sanitize_text_field($_POST['specific_places']);
        $transport       = sanitize_text_field($_POST['transport']);
        $accommodation   = sanitize_text_field($_POST['accommodation']);
        $food            = sanitize_text_field($_POST['food']);
        ?>
        <div class="travel-plan-container">
            <div class="travel-plan-output" id="travel-plan-output">
【あなたにピッタリな旅行プラン】
📅 <?php echo esc_html($destination); ?>・旅行 <?php echo esc_html($days); ?>日間プラン

【入力内容】
出発地：<?php echo esc_html($departure); ?>

旅行先：<?php echo esc_html($destination); ?>

旅行の時期：<?php echo esc_html($season); ?>

旅行の目的：<?php echo esc_html($purpose); ?>

旅行日数：<?php echo esc_html($days); ?>日
旅行人数：<?php echo esc_html($people); ?>人
旅行予算：<?php echo esc_html($budget); ?>

やりたいこと・体験：<?php echo esc_html($interests); ?>

絶対に行きたい場所：<?php echo esc_html($specific_places); ?>

移動手段：<?php echo ($transport) ? esc_html($transport) : "（未指定）"; ?>

宿泊の希望：<?php echo esc_html($accommodation); ?>

食事のこだわり：<?php echo esc_html($food); ?>
            </div>
            <p class="ai-notice">
                この旅行プランは生成AIによって作成されました。内容に誤りが含まれている可能性があります。
            </p>
            <!-- コピーボタン -->
            <div style="text-align: center; margin-top: 20px;">
                <button class="copy-button" id="copy-button">コピー</button>
            </div>
            <script>
            document.getElementById('copy-button').addEventListener('click', function(){
                var text = document.querySelector('.travel-plan-output').innerText;
                navigator.clipboard.writeText(text).then(function(){
                    alert('旅行プランをコピーしました！');
                }, function(){
                    alert('コピーに失敗しました。');
                });
            });
            </script>
            <!-- 入力画面に戻る と LINEで共有する -->
            <div class="button-row" style="justify-content: center;">
                <a href="<?php echo esc_url( get_permalink() ); ?>" class="return-link">入力画面に戻る</a>
                <a href="https://social-plugins.line.me/lineit/share?url=<?php echo urlencode(get_permalink()); ?>" class="affiliate-button">LINEで共有する</a>
            </div>
            <!-- 3つのボタン（じゃらん、楽天トラベル、Agoda） -->
            <div class="extra-links">
                <a href="https://www.jalan.net/" class="jaran" target="_blank">じゃらん</a>
                <a href="https://travel.rakuten.co.jp/" class="rakuten" target="_blank">楽天トラベル</a>
                <a href="https://www.agoda.com/" class="agoda" target="_blank">Agoda</a>
            </div>
        </div>
        <!-- ページロード時に結果部分へ自動スクロール -->
<script>
document.addEventListener("DOMContentLoaded", function(){
    // 自動スクロール機能（結果部分へ）
    var output = document.getElementById("travel-plan-output");
    if(output) {
        output.scrollIntoView({ behavior: "smooth" });
    }

});
</script>

        <?php
    }
    return ob_get_clean();
}
add_shortcode('travel_plan_form', 'travel_plan_form_shortcode');