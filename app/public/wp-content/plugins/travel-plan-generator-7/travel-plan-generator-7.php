<?php
/**
 * Plugin Name: Travel Plan Generator 7
 * Description: 旅行プランを自動生成するプラグイン
 * Version: 1.0.0
 * Author: Your Name
 */

// プラグインのセキュリティ対策
defined('ABSPATH') || exit;

// プラグインのメインクラスをロード
require_once plugin_dir_path(__FILE__) . 'includes/class-travel-plan-generator.php';

// プラグインの初期化
function tpg7_init() {
    $travel_plan_generator = new Travel_Plan_Generator();
    $travel_plan_generator->init();
}
add_action('plugins_loaded', 'tpg7_init');

// ショートコードの登録
function tpg7_register_shortcode() {
    add_shortcode('travel_plan_form7', array('Travel_Plan_Generator', 'render_form'));
}
add_action('init', 'tpg7_register_shortcode');
