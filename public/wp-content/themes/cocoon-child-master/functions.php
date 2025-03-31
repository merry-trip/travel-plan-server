<?php //子テーマ用関数
if ( !defined( 'ABSPATH' ) ) exit;

//子テーマ用のビジュアルエディタースタイルを適用
add_editor_style();

//以下に子テーマ用の関数を書く
//
// 特定の固定ページ（travel-plan-generator）のアクセスを1日3回までに制限（プレビューは除外）
function limit_specific_page_access() {
    if (!is_user_logged_in()) {
        return; // 未ログインユーザーには制限を適用しない
    }

    if (is_preview()) {
        return; // プレビュー画面では制限を適用しない
    }

    $user_id = get_current_user_id(); // ユーザーIDを取得
    $page_slug = 'travel-plan-generator'; // 制限をかけるページのスラッグ（URLの一部）

    if (!is_page($page_slug)) {
        return; // 指定したページ以外では制限を適用しない
    }

    $limit = 3; // 1日の最大アクセス回数
    $key = 'page_access_count_' . $page_slug . '_' . date('Y-m-d'); // ユーザーごとに日付ごとに記録

    $access_count = get_user_meta($user_id, $key, true);
    if (!$access_count) {
        $access_count = 0;
    }

    if ($access_count >= $limit) {
        wp_die('このページのアクセス回数の上限に達しました。明日またお試しください。'); // アクセス制限のメッセージ
    }

    update_user_meta($user_id, $key, $access_count + 1);
}
add_action('template_redirect', 'limit_specific_page_access');
