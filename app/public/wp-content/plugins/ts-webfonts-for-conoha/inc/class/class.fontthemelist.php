<?php

class TypeSquare_ST_Fontthemelist {
  private static $instance;

	private function __construct(){}

  public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			$c = __CLASS__;
			self::$instance = new $c();
		}
		return self::$instance;
	}

  public function get_fonttheme_list()
    {
      return array(
        "basic" => [
          "name" => "ベーシック",
          "fonts" => [
            "title" => "ゴシックMB101 M",
            "lead" => "ヒラギノ角ゴ W2 JIS2004",
            "content" => "TBUDゴシック R",
            "bold" => "TBUDゴシック E"
          ]
        ],
        "business" => [
          "name" => "ビジネス",
          "fonts" => [
            "title" => "見出ゴMB31",
            "lead" => "UD黎ミン R",
            "content" => "UD新ゴ コンデンス90 L",
            "bold" => "UD新ゴ コンデンス90 M"
          ]
        ],
        "pop" => [
          "name" => "ポップ",
          "fonts" => [
            "title" => "キャピーN R",
            "lead" => "じゅん 501",
            "content" => "じゅん 201",
            "bold" => "じゅん 501"
          ]
        ],
        "crisp" => [
          "name" => "クリスプ",
          "fonts" => [
            "title" => "DSダダ",
            "lead" => "DSそよ風",
            "content" => "トーキング",
            "bold" => "トーキング"
          ]
        ],
        "luxury" => [
          "name" => "ラグジュアリー",
          "fonts" => [
            "title" => "A1明朝",
            "lead" => "A1明朝",
            "content" => "UD黎ミン R",
            "bold" => "UD黎ミン B"
          ]
        ],
        "conoha" => [
          "name" => "このは1",
          "fonts" => [
            "title" => "ハルクラフト",
            "lead" => "ハルクラフト",
            "content" => "那欽",
            "bold" => "那欽"
          ]
        ],
        "conoha2" => [
          "name" => "このは2",
          "fonts" => [
            "title" => "はるひ学園",
            "lead" => "丸フォーク M",
            "content" => "シネマレター",
            "bold" => "シネマレター"
          ]
        ]
      );
    }

  public function get_url()
    {
      return array(
        "file_domain" => "",
        "font_css" => "",
	      "font_json" => ""
      );
    }
}