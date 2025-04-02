jQuery(document).ready(function($) {
    // フォーム送信イベントの設定
    $('#tpg7-travel-form').on('submit', function(e) {
        e.preventDefault();
        
        // フォームデータを取得
        const formData = {
            destination: $('#tpg7-destination').val(),
            dates: $('#tpg7-dates').val(),
            interests: $('#tpg7-interests').val(),
            action: 'tpg7_generate_plan',
            _ajax_nonce: tpg7_vars.nonce
        };

        // デバッグログ
        console.log('Sending AJAX request with data:', formData);

        // ローディング表示
        $('#tpg7-submit').prop('disabled', true).text('処理中...');
        $('#tpg7-results').html('').removeClass('error success');

        // AJAXリクエストの送信
        $.ajax({
            url: tpg7_vars.ajax_url,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log('Received response:', response);
                if (response.success) {
                    $('#tpg7-results')
                        .addClass('success')
                        .html(formatResponse(response.data));
                } else {
                    $('#tpg7-results')
                        .addClass('error')
                        .html('エラーが発生しました: ' + response.data);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                $('#tpg7-results')
                    .addClass('error')
                    .html('通信エラーが発生しました。詳細: ' + error);
            },
            complete: function() {
                $('#tpg7-submit').prop('disabled', false).text('プラン生成');
            }
        });
    });

    // レスポンスデータのフォーマット関数
    function formatResponse(data) {
        let html = '<div class="response-container">';
        
        // 基本情報
        html += '<div class="section">';
        html += '<h3>基本情報</h3>';
        html += '<p><strong>目的地:</strong> ' + data.destination + '</p>';
        html += '<p><strong>期間:</strong> ' + data.dates + '</p>';
        html += '</div>';

        // 天気情報
        if (data.weather) {
            html += '<div class="section">';
            html += '<h3>天気予報</h3>';
            html += '<p>' + data.weather + '</p>';
            html += '</div>';
        }

        // 移動情報
        if (data.route) {
            html += '<div class="section">';
            html += '<h3>移動情報</h3>';
            html += '<p><strong>距離:</strong> ' + data.route.distance + '</p>';
            html += '<p><strong>所要時間:</strong> ' + data.route.duration + '</p>';
            html += '</div>';
        }

        // 観光スポット
        if (data.places && data.places.length > 0) {
            html += '<div class="section">';
            html += '<h3>おすすめスポット</h3>';
            html += '<ul>';
            data.places.forEach(function(place) {
                html += '<li>' + place.name + ' (' + place.type + ')</li>';
            });
            html += '</ul>';
            html += '</div>';
        }

        html += '</div>';
        return html;
    }
});
