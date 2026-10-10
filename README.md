# GitHub JA UI

GitHub JA UI は、GitHub の操作を意味が分かる日本語で案内する Chrome 拡張です。一般的な UI を自然な日本語にし、GitHub 固有の概念は、初めて使う人も機能を推測できる言葉にします。たとえば Issues は「課題と相談」、Pull requests は「変更の提案」、Fork は「自分用にコピー」と表示し、必要に応じて元の用語と短い説明をツールチップで確認できます。

## 目的と対象ユーザー

GitHub を使える人と使えない人の間にある、情報・機会の格差を縮めることを目指します。OSS、教材、研究、ツールなどを探す人、GitHub を初めて使う人、非エンジニアも対象です。「日本語で読める」「操作の意味が分かる」「次に何をすればよいか推測できる」の三つを設計の目安にします。Mission と Concept は [PRODUCT_CONCEPT.md](PRODUCT_CONCEPT.md) にまとめています。

## Chrome 標準翻訳との関係

Chrome 標準翻訳はページの言語を翻訳します。GitHub JA UI は一般的な UI の日本語化に加え、GitHub 固有の概念や操作を意味の分かる言葉で案内します。GitHub JA UI 単体でも一貫して使えるよう、Home →「ホーム」や Settings →「設定」のような一般 UI の翻訳も維持します。

## 主な機能

- ナビゲーション、ボタン、メニュー、ダイアログなど、判別できる GitHub 公式 UI の短い文言を日本語にします。
- GitHub 固有の概念には意味が伝わるラベルと短いツールチップを用意します。元の GitHub 用語も説明に残します。Git、Copilot、Codespaces、MCP のような固有名称は維持し、必要に応じて意味を補います。
- すでに自然な日本語は変更しません。README などの自然言語は対象になり得ますが、現時点では確認済みの短い英語文だけを拡張内の辞書で変換します。自由文の網羅的な翻訳には別の仕組みが必要です。
- username、リポジトリ・組織名、branch・tag、ファイル・ディレクトリ名、path、URL、コード、コマンド、フォーム入力値などの技術的識別子を原形のまま保ちます。リンクやボタンのDOM境界も変更しません。
- 動的に追加された UI に対応します。ポップアップで ON/OFF を切り替えられ、OFF で変更済みの文言を可能な範囲で戻します。

これは初期版です。GitHub の画面構造や表示文言は変わるため、すべての UI が翻訳されるわけではありません。誤変換を避けるため、保守的に適用します。

Chrome 標準翻訳を同時に使うと、標準翻訳が username やファイル名、README のリンク境界まで書き換えることがあります。拡張単体の動作を確認するときは Chrome 標準翻訳を「英語」に戻してページを再読み込みしてください。拡張の ON/OFF は Chrome 標準翻訳の変更を元に戻すものではありません。

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

0.1.3 では Repository の fixture を追加し、英語の自然文、日本語の原文、技術的識別子、分割された Fork、リンク境界を確認します。Chrome 標準翻訳をONにしたログイン済みChromeでは、拡張をOFFにしても username・branch・ファイル名の翻訳と README のリンク範囲の変化が残り、Chrome翻訳を原文に戻すと消えました。Chrome翻訳との同時使用時のDOM変更は拡張側からは復元できません。別のChromiumで 0.1.3 の dist を読み込んだ公開リポジトリでは、Issues / Actions の一部のUIが日本語になり、scripts ディレクトリ名は原形を維持することを確認しました。

2026-10-09 に、Chrome 標準翻訳の「英語を常に翻訳」を解除して原文の英語に戻し、ログイン済み Chrome に 0.1.3 の `dist/` を再読み込みして実サイトを確認しました。以下は実サイトで観察できた範囲です。「一部確認」はその列のすべてを検証した意味ではありません。通知メニューの取りこぼしは実サイトの DOM で原因を確認して修正し、更新した `dist/` を再読み込みして再確認しました。

| 画面 | 日本語・概念説明 | 投稿内容・名前の保護 | 操作・レイアウト | ON/OFF・再読込・動的 UI | Console |
| --- | --- | --- | --- | --- | --- |
| Home | 主要 UI と展開メニューは確認。上部の `All repositories` は英語 | 表示された username・repository 名は原形 | 展開メニューと表示は確認。全リンクのクリック先・全画面幅は未確認 | 展開メニューの表示後翻訳を確認。個別画面での切替は未確認 | GitHub Copilot の 404 のみ観察。拡張由来の例外なし |
| Repository | Issues・Pull requests・Actions・Projects・Fork を確認。`Code` は英語 | `haruka-ds`、`github-ja-ui`、`main`、指定された directory・filename、日本語 README は原形 | Fork は「自分用にコピー」と全文表示。README 対象段落のリンクは1件で、href・クリック先・末尾の通常テキストを確認。全操作は未確認 | 通常リンクで Issues → Pull requests → Actions → Repository を遷移。個別画面での切替は未確認 | GitHub Copilot の 404 のみ観察。拡張由来の例外なし |
| Issues | ナビゲーションは日本語。見出し、`New issue`、空状態などは英語 | repository 名は原形。Issue 本文・コメントは表示例がなく未確認 | 画面遷移は確認。作成操作と詳細レイアウトは未確認 | Repository から通常リンクで遷移。動的 UI は未確認 | 未確認 |
| Pull Requests | ナビゲーションと一部見出しは日本語。`New pull request`、空状態などは英語 | repository 名は原形。PR 本文・コメントは表示例がなく未確認 | 画面遷移は確認。作成操作と詳細レイアウトは未確認 | Issues から通常リンクで遷移。動的 UI は未確認 | GitHub Copilot の 404 を観察。拡張由来の例外なし |
| Actions | ナビゲーションは日本語。`All workflows`、フィルターなどは英語 | 見出し内の `haruka-ds/github-ja-ui` は原形。実行ログは未確認 | 画面遷移は確認。ワークフロー操作は未確認 | Pull requests から通常リンクで遷移。動的 UI は未確認 | 未確認 |
| Projects | ページ見出しは「作業計画」。`Repository projects`、空状態は英語 | repository 名は原形。Project 項目は表示例がなく未確認 | 画面表示を確認。作成操作は未確認 | 通常リンクで遷移。動的 UI は未確認 | GitHub Copilot の 404 を観察。拡張由来の例外なし |
| Settings | ナビゲーション・主なラベルは日本語。説明文・一部ボタンは英語 | `haruka-ds` と入力値は原形。テスト入力は保存せず消去 | 名前欄の入力と消去を確認。設定保存は未実施 | ON → OFF → ON で代表ラベルが英語へ復元し再翻訳。再読込も確認 | GitHub Copilot の 404 のみ観察。拡張由来の例外なし |
| Search | 一部フィルターは日本語。検索見出し・結果数などは英語 | 検索結果の `haruka-ds/github-ja-ui` は原形 | 検索実行と結果表示を確認。全フィルターは未確認 | 検索ダイアログ表示後の一部翻訳を確認。切替は未確認 | GitHub Copilot の 404 のみ観察。拡張由来の例外なし |
| Profile | 多くの公式 UI が英語 | `haruka-ds` と表示された repository 名は原形 | プロフィールへの遷移を確認。詳細操作・レイアウトは未確認 | 動的 UI と切替は未確認 | 未確認 |
| Notifications | 主要 UI・説明文・並べ替え・グループ分けは日本語。メニュー選択肢の修正後も実サイトで確認 | username・repository 名を含む通知内容は、受信箱が空で未確認 | 並べ替えを古い順へ変更し新しい順へ戻した。全リンク・全画面幅は未確認 | メニュー表示後の翻訳、ON → OFF で原文復元 → 再ONで再翻訳を確認。重複なし | GitHub Copilot の 404 のみ観察。拡張由来の例外なし |

### 0.1.4 の実サイト確認（2026-10-09）

Chrome 標準翻訳を原文の英語にし、更新した `dist/` の 0.1.4 をログイン済み Chrome に再読み込みした。英語残存箇所、DOM の役割、翻訳候補、保留理由、画面ごとの件数は [UI カバレッジ棚卸し](docs/UI_COVERAGE_0.1.4.md) に記録した。以下の状態は自動 fixture ではなく実サイトで観察した範囲を示す。「確認済み」は記載した項目を観察できた場合、「一部確認」は画面内の一部のみ、「未確認」は実データや状態がなかった場合を指す。

| 画面 | 0.1.4 の実サイト結果 | 状態 | 残る確認事項 |
| --- | --- | --- | --- |
| Home | 「すべてのリポジトリ」「メニューを開く」「ユーザーメニューを開く」、挨拶と既存の主要 UI を確認。表示された username・repository 名は原形 | 一部確認 | すべてのカード・ツールチップの表示状態 |
| Repository | 「コード」「最新の変更」「フォルダーとファイル」、branch/tag リンクを確認。`haruka-ds`、`github-ja-ui`、`main`、ファイル・ディレクトリ名は原形 | 一部確認 | 全ファイル表の列名、README リンク境界の 0.1.4 での目視再確認 |
| Issues | 「課題や相談を作成」「課題と相談を検索」、空状態を確認。公開 Issue のタイトル・本文・コメント・username は原形 | 一部確認 | 作成画面と全フィルター |
| Pull requests | 「変更を提案」「変更の提案を検索」、空状態を確認。公開 PR のタイトル・本文・branch・SHA・username は原形 | 一部確認 | レビュー・差分画面と全フィルター |
| Actions | 「新しい自動処理」「すべての自動処理」「管理」、実行一覧を確認。workflow 名・commit・branch は原形 | 一部確認 | 実行ログ、可変の件数、Attestations |
| Projects | 「作業計画を関連付ける」「このリポジトリの作業計画」、空状態を確認 | 一部確認 | 実在する project の項目と操作 |
| Settings | 見出し、プロフィールの説明文、所属・所在地、更新ボタンの翻訳を確認。表示済みの入力値は原形 | 一部確認 | 長文の同意・法的説明、全フォーム状態 |
| Search | 「絞り込み条件」「使用言語」「ほかの言語」、結果カテゴリを確認。query と検索結果の repository 名は原形 | 一部確認 | 全詳細フィルターと並べ替え選択肢 |
| Profile | 「概要」「作業計画」「プロフィールを編集」「よく見られるリポジトリ」を確認。username と repository 名は原形 | 一部確認 | 可変の貢献数と未展開メニュー |
| Notifications | 通知の主要 UI、動的な「通知の設定」メニュー、並べ替えを確認。ON → OFF → ON で原文復元と再翻訳を実サイトで確認 | 一部確認 | 受信箱が空のため実通知本文は未確認 |

Repository → Issues → Pull requests → Actions → Repository を通常の GitHub リンクで移動し、各ページで追加した代表 UI が翻訳された。公開の `microsoft/vscode` Issue #100000 と #340684、PR #340683 では、タイトル・本文・コメント・username・branch・commit SHA の原形を確認した。実通知の投稿内容と実在する project 項目は未確認。0.1.4 の自動テストではリンク・ボタン・入力の DOM 境界、再処理、ON/OFF、SPA、動的追加を確認するが、それを実サイトの全状態での目視確認済み扱いにはしない。

### 0.1.4 Release Candidate 実機監査（2026-10-10）

ログイン済み Chrome で標準翻訳を英語の原文にし、0.1.4 の拡張を使って実サイトを再確認した。以下は今回実際に観察した範囲であり、固定 fixture の結果を実機確認に含めない。保留16項目の A/B/C 分類と根拠は [UI カバレッジ棚卸し](docs/UI_COVERAGE_0.1.4.md) を参照。B のファイル一覧列名3件だけを限定して対応したため、生成物の版は 0.1.5 とした。

| 画面 | Console | 通常幅・狭めのデスクトップ幅での表示 | 実データ・未確認事項 |
| --- | --- | --- | --- |
| Home | 拡張由来の error / warning なし | 主要カード・ナビゲーションの欠けや重なりなし | 展開状態の全操作は未確認 |
| Repository | 拡張由来の error / warning なし | Fork「自分用にコピー」、ナビゲーション、ファイル一覧に破綻なし | README の日本語原文を保持。末尾の PRODUCT_CONCEPT.md だけがリンク1件で、前後は通常テキスト。href とクリック先を再確認 |
| Issues | 拡張由来の error / warning なし | フィルター、作成ボタン、空状態に破綻なし | 前回確認した公開 Issue の本文・コメント保護を自動テストでも継続確認。今回の再読は未実施 |
| Pull requests | 拡張由来の error / warning なし | フィルター、作成ボタン、空状態に破綻なし | 前回確認した公開 PR の本文・branch 保護を自動テストでも継続確認。今回の再読は未実施 |
| Actions | 拡張由来の error / warning なし | ナビゲーション、フィルター、実行一覧に破綻なし | 実行ログ内部は未確認 |
| Projects | 拡張由来の error / warning なし | リポジトリ側の空状態と公開 Project の表に破綻なし | `microsoft/vscode` の実 Project で project 名、item title、assignee、状態・優先度などの field value、issue / PR link、repository 識別子が原形 |
| Settings | 拡張由来の error / warning なし | サイドメニュー、見出し、フォームの折り返しに破綻なし | 保存を伴う操作は未実施 |
| Search | 拡張由来の error / warning なし | フィルターと結果表示に破綻なし | query と repository 名は原形 |
| Profile | 拡張由来の error / warning なし | ナビゲーション、プロフィール、repository カードに破綻なし | 個別メニューは未確認 |
| Notifications | 拡張由来の error / warning なし | 並べ替え、グループ分け、空状態に破綻なし | 受信箱・保存済み・完了が空で、実通知 title・本文・link destination は未確認 |

Console には複数画面で GitHub 本体の `/github-copilot/chat/entitlement` への 404 が出た。拡張由来の例外とは分けて記録した。0.1.4 の README リンク段落では、`PRODUCT_CONCEPT.md` の href が `/haruka-ds/github-ja-ui/blob/main/PRODUCT_CONCEPT.md` で、クリック先も一致した。「にまとめています。」と末尾の「ます」はリンク外で、日本語原文も変化していなかった。

実通知データの保護は未確認のため、Chrome Web Store 公開準備は保留する。実データを観察できた時点で title・repository・username・本文・リンク先を確認する。自動テストの成功を実通知の確認済み扱いにはしない。

## ライセンス

[MIT](LICENSE)
