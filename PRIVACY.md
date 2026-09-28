# プライバシー

GitHub JA UI は GitHub の画面上でローカルに文字列を照合し、表示を変更します。外部翻訳 API、バックエンド、広告、Analytics、Telemetry、追跡ピクセルはありません。閲覧履歴やページ内容を収集・送信しません。

Chrome 権限は `storage` だけを使い、ON/OFF 設定を端末内に保存します。コンテンツスクリプトは `https://github.com/*` のみで動きます。GitHub 以外のホスト権限は要求しません。

翻訳の対象外として、README、Markdown、ソースコード、Issue・PR 本文とコメント、入力欄などを保護します。ただし GitHub の DOM は変わるため、保護判定に改善が必要な場合は Issue または PR で報告してください。
