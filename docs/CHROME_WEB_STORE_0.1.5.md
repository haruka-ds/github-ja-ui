# Chrome Web Store 提出準備 — GitHub JA UI 0.1.5

確認日: 2026-10-11。これはダッシュボードに入力する原稿と監査記録です。アップロード、審査提出、公開、tag/release作成は行っていません。画面上の必須項目は提出時にも再確認してください。

## 提出可否と棚卸し

**現時点では提出不可。** 拡張本体の監査用 ZIP と文面は用意できる一方、128 px の独自アイコン、実画面のスクリーンショット、440×280 px の小プロモーション画像がない。これらを揃え、最後にZIPを再生成してからアップロードする。スクリーンショットをfixtureで代用しない。

| 項目 | 現状 / 入力先 |
| --- | --- |
| extension ZIP / manifest | `release/github-ja-ui-0.1.5.zip` は監査用候補。manifest v3、name/version/description/content script/action、`storage` のみ |
| 名前 / 短文 / 詳細文 | 下記の原稿を用意。名前は `GitHub JA UI` |
| カテゴリ / 言語 | Productivity（ダッシュボードで選択肢を確認）、日本語 |
| 単一目的 / 権限理由 / データ利用 | 下記の Privacy 原稿を用意。実際のフォーム表示に照らして回答 |
| プライバシーポリシー / ホーム / サポート | 公開 GitHub URL の候補を下記に記載。リンク到達性をアップロード時に確認 |
| ストアアイコン | **不足**。独自 PNG 128×128 px。manifest の `icons` と action icon を追加する場合は 16/32/48 px も作り、再ビルド・再検証 |
| スクリーンショット | **不足**。最低1枚、候補4枚。1280×800 px 推奨、640×400 px も可 |
| 小プロモーション画像 | **不足**。440×280 px PNG/JPEG |
| Marquee画像 | 任意。1400×560 px。今回は不要 |
| プロモーション動画 | 実ダッシュボードで必須表示なら要対応。公式の「Supplying Images」は必須素材をアイコン・小画像・スクリーンショットと記述する一方、「Complete your listing information」は動画も必須と記述し、資料間に差異があるため画面で確認 |
| ソース / ライセンス | 公開リポジトリと MIT LICENSE。ビルドで `dist/LICENSE` に同梱 |
| 配信範囲 / アカウント | ダッシュボードで人間が設定。開発者登録、本人確認、支払、2段階認証が要求された場合も人間が対応 |
| 審査者向け説明 | 下記の手順を Test instructions 欄が必要な場合に記入。認証情報は不要 |

参照: [公開手順](https://developer.chrome.com/docs/webstore/publish/)、[manifestとZIP](https://developer.chrome.com/docs/webstore/prepare/)、[掲載情報](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/)、[画像](https://developer.chrome.com/docs/webstore/images/)、[Privacy欄](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/)。

## 掲載文面

**名前:** GitHub JA UI

**短い説明（132文字以内）:** GitHub の操作を意味が分かる日本語で案内。公式 UI を読みやすくし、専門用語には短い説明を添えます。

**詳細説明:**

GitHub JA UI は、GitHub の公式画面で操作に使う英語を、意味を推測しやすい日本語で案内する Chrome 拡張です。GitHub を使い始めた人や、英語の画面に慣れていない人を対象にしています。

ナビゲーションやボタンなどの一般的な UI は自然な日本語にします。GitHub 固有の概念は、Issues →「課題と相談」、Pull requests →「変更の提案」、Fork →「自分用にコピー」、Actions →「自動処理」のように操作の意味が分かる言葉にします。必要に応じて元の用語と短い説明も確認できます。Chrome 標準翻訳が文章を翻訳するのに対し、この拡張は GitHub の操作と概念を案内することに重点を置きます。

username、リポジトリ名、branch、ファイル名、コード、README や Issue・PR の投稿内容、入力中の値は原則として変更しません。ポップアップから ON/OFF を切り替えられます。処理は端末内で完結し、外部翻訳 API、開発者のサーバー、広告、追跡、アクセス解析を使用しません。

初期版のため、GitHub のすべての英語を変換するものではありません。画面構造の変更や判定しにくい文言は原文のまま残ります。Chrome 標準翻訳を同時に使うと、そちらによるページ変更は本拡張の OFF 操作では復元できません。

この拡張は有志による非公式ツールであり、GitHub, Inc. の公式製品・提携製品ではありません。

**Single Purpose（一文）:** GitHub の公式画面で操作に使う英語の UI 文言を、日本語話者が意味を理解して操作できる日本語に変換します。

## Privacy / 権限申告案

- `storage`: 拡張の ON/OFF 設定の真偽値だけを端末内に保存し、次回も設定を維持するため。
- `https://github.com/*` の content script: GitHub 公式 UI の文言を端末内で判別・表示変更するため。GitHub 以外では実行しない。`host_permissions` は宣言していない。
- リモートコード: 使用しない。外部翻訳 API、サーバー、追跡コードを読み込まない。
- データ利用: GitHub ページの内容を**端末内で処理**するが、開発者への収集・送信・共有・永続保存はしない。保存するのは ON/OFF の真偽値のみ。広告、analytics、販売、信用審査に利用しない。
- ダッシュボードの「収集するデータ」欄では、実際の質問文に従って回答する。「外部送信・開発者による収集」の意味なら該当カテゴリなし。**端末内での処理も含むかを表示文言で確認**し、必要なら「ウェブサイトのコンテンツ」のローカル処理を正確に申告する。実装にないカテゴリを予防的にチェックしない。Limited Use の確認事項は実態どおりに回答する。
- プライバシーポリシーは [PRIVACY.md](../PRIVACY.md)。端末内処理と外部収集なしを区別して記載した。Chrome はローカル処理でも開示を要求するため、この区別を維持する。

参照: [Privacy欄](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/)、[User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)、[Privacy Policy](https://developer.chrome.com/docs/webstore/program-policies/privacy/)。

## manifest / ZIP 監査

`manifest_version: 3`、`name: GitHub JA UI`、`version: 0.1.5`、短い `description`、`permissions: ["storage"]`、`content_scripts.matches: ["https://github.com/*"]`、`run_at: document_idle`、`action.default_popup: popup.html` を確認した。`host_permissions`、`icons`、CSP、`externally_connectable`、`web_accessible_resources` は未宣言。後ろの3項目は現機能には不要。`icons` は提出までに独自素材を用意して追加する必要がある。GitHub ロゴ・Octocat を流用しない。

`npm run package:store` は `dist/` を作り直し、`manifest.json`、`content.js`、`popup.js`、`popup.html`、`LICENSE` の5ファイルだけをZIPのルートに封入する。`node_modules`、tests、`.git`、source map、ローカルパス、重複ファイルは含めない。将来アイコンを追加するときはビルドと allowlist を更新する。生成ZIPを提出用と呼ぶのは、その後の素材と再監査が終わってから。

## ストア画像案

独自アイコンは 128×128 px の透明 PNG を基本とし、図柄は約96×96 px に収めて周囲16 pxを透明にする。明暗両背景で視認性を確かめる。必要なバリエーションは 128 px（ストア必須）と、manifest / ツールバー表示を採用する場合の 16、32、48 px。現時点ではPNGが1枚もなく、alpha・背景・視認性・混同リスクの実物監査は未実施。

スクリーンショットは実際の拡張 ON / Chrome 標準翻訳「英語（原文）」で撮影し、原寸 1280×800 px、余白なし、最大5枚にする。公開リポジトリなどを使い、個人の通知、メール、アバター、私的な識別子は写さないか適切に隠す。加工で拡張の動作を誇張しない。

| 候補 | 見せるもの | 変換例 / 個人情報の扱い |
| --- | --- | --- |
| 1 Repository | リポジトリ上部のナビゲーション | Issues「課題と相談」、Pull requests「変更の提案」、Actions「自動処理」、Fork「自分用にコピー」。公開リポジトリの識別子は原形 |
| 2 Issues | 一覧の公式操作と保護の両立 | フィルターや作成ボタン。公開 Issue のタイトル・投稿者は原形、私的な通知は映さない |
| 3 Pull requests | 一覧と変更の提案 | 公式タブ・操作が日本語、PRタイトルやbranchは原形。公開データのみ |
| 4 Notifications または Actions | 通知の公式操作、またはワークフロー画面 | Notificationsは実CI通知のみ、必要なら識別情報を隠す。Actionsなら公開CI画面で「自動処理」を示す |

小プロモーション画像（440×280 px）は GitHub の商標や公式UIを模したロゴを使わない独自デザインにする。Marquee（1400×560 px）は任意。実画像がないため品質確認は未実施。

## URL / 商標 / 審査者向け

- ホーム: https://github.com/haruka-ds/github-ja-ui
- サポート: https://github.com/haruka-ds/github-ja-ui/issues （問い合わせ先として使う。公開Issueに機密情報を投稿しないよう案内）
- プライバシー: https://github.com/haruka-ds/github-ja-ui/blob/main/PRIVACY.md
- ソース / MIT: https://github.com/haruka-ds/github-ja-ui と https://github.com/haruka-ds/github-ja-ui/blob/main/LICENSE
- 「Official URL」は所有確認済みサイトの専用欄なので、GitHub リポジトリURLを所有確認済みと偽って指定しない。ホーム／サポート欄なら候補として使う。専用ドメインは現時点で必須と判断しない。
- 非公式表記: 「GitHub JA UI は有志による非公式拡張であり、GitHub, Inc. の公式製品・提携製品ではありません。」名前は現状維持。GitHub の名称は対象サイトを説明するためにのみ使い、公式ロゴ・Octocatは素材に使わない。
- Test instructions 案: 「Chrome標準翻訳を英語の原文にし、拡張をONにして github.com/haruka-ds/github-ja-ui を開いてください。Issues、Pull requests、Actions、Fork の公式ラベルが日本語になり、リポジトリ名やREADME本文は原形です。ポップアップでOFFにすると変更済みラベルが元に戻ります。ログインは不要です。」

参照: [誤認・知的財産ポリシー](https://developer.chrome.com/docs/webstore/program-policies/impersonation-and-intellectual-property/)、[掲載要件](https://developer.chrome.com/docs/webstore/program-policies/listing-requirements/)。

## 推奨リリース情報（未作成）

- tag: `v0.1.5`
- title: `GitHub JA UI 0.1.5`
- notes: 「GitHub の公式 UI を意味の分かる日本語で案内する初期公開候補。UIの表示切替、ユーザーコンテンツ保護、動的UI対応を含む。すべての英語を翻訳するものではありません。外部翻訳API・追跡は使用しません。」
- ストア提出用ZIPと同じcommitを指すようにし、素材追加・manifest更新後の最終commitで作る。今回tag/releaseは作らない。

## 人間が最後に行うこと

1. 独自アイコンとストア用画像を作成・確認し、アイコンをmanifest / `dist/` に反映する。実サイト画面を撮影し、個人情報とChrome翻訳状態を確認する。
2. 最終commitからテスト、ZIP再生成、内容とチェックサムの確認を行う。
3. 開発者アカウント登録、必要な本人確認・料金支払・2段階認証を済ませ、ダッシュボードにログインする。
4. ZIPをアップロードし、掲載情報、カテゴリ、言語、画像、ホーム/サポート/プライバシーURL、配信範囲を入力する。
5. Privacy欄の単一目的、`storage`、サイトアクセス、リモートコード、データ利用、Limited Use を実際の質問文で照合して回答する。必要ならTest instructionsを記入する。
6. プレビューで画像・文面・非公式表示・権限・URLを確認する。審査へ送る操作は今回の範囲外。
