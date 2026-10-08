# GitHub JA UI

GitHub JA UI は、GitHub の操作を意味が分かる日本語で案内する Chrome 拡張です。一般的な UI を自然な日本語にし、GitHub 固有の概念は、初めて使う人も機能を推測できる言葉にします。たとえば Issues は「課題と相談」、Pull requests は「変更の提案」、Fork は「自分用にコピー」と表示し、必要に応じて元の用語と短い説明をツールチップで確認できます。

## 目的と対象ユーザー

GitHub を使える人と使えない人の間にある、情報・機会の格差を縮めることを目指します。OSS、教材、研究、ツールなどを探す人、GitHub を初めて使う人、非エンジニアも対象です。「日本語で読める」「操作の意味が分かる」「次に何をすればよいか推測できる」の三つを設計の目安にします。Mission と Concept は [PRODUCT_CONCEPT.md](PRODUCT_CONCEPT.md) にまとめています。

## Chrome 標準翻訳との関係

Chrome 標準翻訳はページの言語を翻訳します。GitHub JA UI は一般的な UI の日本語化に加え、GitHub 固有の概念や操作を意味の分かる言葉で案内します。GitHub JA UI 単体でも一貫して使えるよう、Home →「ホーム」や Settings →「設定」のような一般 UI の翻訳も維持します。

## 主な機能

- ナビゲーション、ボタン、メニュー、ダイアログなど、判別できる GitHub 公式 UI の短い文言を日本語にします。
- GitHub 固有の概念には意味が伝わるラベルと短いツールチップを用意します。元の GitHub 用語も説明に残します。Git、Copilot、Codespaces、MCP のような固有名称は維持し、必要に応じて意味を補います。
- username、リポジトリ・組織名、README、Markdown、Issue・PR のタイトル・本文・コメント、Discussions 本文、commit message、release notes、コード、ファイル・ディレクトリ名、フォーム入力値などを保護します。判断できない文言は変更しません。
- 動的に追加された UI に対応します。ポップアップで ON/OFF を切り替えられ、OFF で変更済みの文言を可能な範囲で戻します。

これは初期版です。GitHub の画面構造や表示文言は変わるため、すべての UI が翻訳されるわけではありません。誤変換を避けるため、保守的に適用します。

## インストール

1. Node.js 22 以上と npm を用意します。
2. `npm ci && npm run build` を実行します。
3. Chrome の `chrome://extensions` を開き、**デベロッパー モード**を有効にします。
4. **パッケージ化されていない拡張機能を読み込む**を選び、生成された `dist/` を指定します。
5. `https://github.com/` を開き、拡張のポップアップから ON/OFF を切り替えます。初期設定は ON です。

## プライバシー

翻訳と説明は拡張内で完結します。外部翻訳 API、サーバー、広告、解析、追跡は使いません。権限は設定保存用の `storage` のみ、コンテンツスクリプトの対象は `https://github.com/*` のみです。詳細は [PRIVACY.md](PRIVACY.md) を参照してください。

## 開発

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

`src/terminology.ts` が辞書と概念説明、`src/protection.ts` が保護判定、`src/engine.ts` がテキストノードと属性の変換・復元、`src/observer.ts` が動的 UI の監視、`src/settings.ts` と `src/popup.ts` が設定を担当します。ビルド後の `dist/` をそのまま Chrome に読み込めます。

## 貢献

用語・説明の改善や安全な UI 対応を歓迎します。[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。既存の翻訳拡張のコードや辞書をコピーしないでください。

## Manual QA

2026-10-07 にログイン後の Home・Notifications・Settings に近い固定 HTML を使い、Playwright Chromium で拡張の読み込み、代表ラベルの翻訳、名前・投稿内容の保護、ON/OFF と再読込、SPA 遷移、動的 UI、open shadow DOM を自動確認しました。`npm run test:e2e` は最新の `dist/` を作成してから Chromium を起動します。固定 HTML は実際のログイン済み GitHub から採取したものではないため、実サイトの表示確認は別途必要です。

2026-10-08 に実際のログイン済み GitHub の Home 展開メニューと Notifications を確認し、固定 HTML に公式リンク先、複合ラベル、説明文、入力欄の構造を追加しました。回帰テストは表示文言だけでなく、ユーザー名、リポジトリ名、投稿記事、入力値を保護することも確認します。実サイトの DOM は随時変わるため、更新版を読み込んで再確認してください。

リリース前の網羅的な目視確認は未完了です。次を確認してください。

| 画面          | 日本語・概念説明 | 投稿内容・名前の保護 | 操作・レイアウト | ON/OFF・再読込・動的 UI | Console |
| ------------- | ---------------- | -------------------- | ---------------- | ----------------------- | ------- |
| Home          | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Repository    | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Issues        | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Pull Requests | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Actions       | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Projects      | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Settings      | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Search        | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Profile       | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |
| Notifications | 未確認           | 未確認               | 未確認           | 未確認                  | 未確認  |

各画面で、説明が邪魔にならないか、ボタン・リンク・フォーム・ドロップダウン・ダイアログが動くか、SPA 遷移後と遅延表示後も安全かを確認してください。

## ライセンス

[MIT](LICENSE)
