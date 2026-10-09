# 0.1.4 実サイト UI 棚卸し

2026-10-09、ログイン済み Chrome で標準翻訳を「英語（原文）」にし、0.1.3 の実サイト表示を調査した。対象は Home、`haruka-ds/github-ja-ui` とその Issues / Pull requests / Actions / Projects、Settings、Search、Profile、Notifications。以下の「対応」は 0.1.4 の辞書と DOM 条件を追加した意味で、すべての画面幅・状態で目視済みという意味ではない。実サイト再確認の範囲は README Manual QA 表を参照。

各行の対象は GitHub 公式 UI と確認したもの。`保留` 行はユーザー情報・識別子との混在、動的数値、法的文面、外部リンク、または表示状態不足により未変換。下表以外の username、repository、branch、filename、path、query、投稿本文、コードは対象外。確度「高」は要素の役割と表示先を特定できた場合、「中」は限定した UI の完全一致、「低」は保留を意味する。

この棚卸しで確認した英語 UI の件数（` / ` 区切りの語を個別に数える）。「対応」は辞書と安全な DOM 条件を用意した件数であり、実サイトの全状態で翻訳された件数ではない。

| 画面 | 確認 | 対応 | 保留・未確認 |
| --- | ---: | ---: | ---: |
| Home | 11 | 9 | 2 |
| Repository | 15 | 10 | 5 |
| Issues | 12 | 12 | 0 |
| Pull requests | 10 | 10 | 0 |
| Actions | 16 | 13 | 3 |
| Projects | 7 | 7 | 0 |
| Settings | 21 | 19 | 2 |
| Search | 15 | 13 | 2 |
| Profile | 11 | 10 | 1 |
| Notifications | 2 | 1 | 1 |
| 合計 | 120 | 104 | 16 |

| 画面 | 英語原文 | DOM上の役割 | 候補・判断 | 意味変換 | 確度 / 状態 |
| --- | --- | --- | --- | --- | --- |
| Home | Open menu | header icon button の参照 tooltip | メニューを開く | なし | 高 / 対応 |
| Home | Open quick search dialog, type / to search ( forward slash ) | header icon button の参照 tooltip | 検索を開く（/） | なし | 高 / 対応 |
| Home | Create new... | header icon button の参照 tooltip | 新しく作成 | なし | 高 / 対応 |
| Home | Open user navigation menu | header icon button の参照 tooltip | ユーザーメニューを開く | なし | 高 / 対応 |
| Home | All repositories | `/repos` icon link の参照 tooltip | すべてのリポジトリ | なし | 高 / 対応 |
| Home | Search for repositories | sidebar button | リポジトリを探す | なし | 高 / 対応 |
| Home | Pull request options | カード button | 変更の提案の表示設定 | あり | 中 / 対応 |
| Home | Issue options | カード button | 課題と相談の表示設定 | あり | 中 / 対応 |
| Home | Dashboard preview options | popup button | 表示設定 | なし | 低 / 保留：状態依存 |
| Home | View changelog → | 外部リンク | GitHub の更新を見る | なし | 低 / 保留：外部リンクと矢印境界 |
| Repository | Code | repository navigation link | コード | なし | 高 / 対応。ファイル名 Code は対象外 |
| Repository | More items | navigation button | その他 | なし | 中 / 対応 |
| Repository | Latest commit | heading | 最新の変更 | あり | 高 / 対応 |
| Repository | Folders and files | heading | フォルダーとファイル | なし | 高 / 対応 |
| Repository | About | sidebar heading | 概要 | なし | 高 / 対応 |
| Repository | Packages | sidebar heading | パッケージ | なし | 高 / 対応 |
| Repository | Contributors | sidebar heading | 参加者 | あり | 高 / 対応 |
| Repository | Languages | sidebar heading | 使用言語 | なし | 高 / 対応 |
| Repository | Go to Branches page | branch link aria-label | 作業の分岐を見る | あり | 高 / 対応 |
| Repository | Go to Tags page | tag link aria-label | タグを見る | なし | 高 / 対応 |
| Repository | Name / Last commit message / Last commit date | file table headers | 名前 / 最終変更 / 変更日 | なし | 低 / 保留：ファイル一覧と識別子の境界を追加調査 |
| Repository | Pin haruka-ds/github-ja-ui | dynamic aria-label | 固定表示 | なし | 低 / 保留：識別子が埋め込まれる |
| Repository | View commit history for this file. | file-specific link aria-label | 変更履歴を見る | あり | 低 / 保留：ファイル行に属する |
| Issues | Assigned to me | sidebar link | 自分が担当 | なし | 高 / 対応 |
| Issues | Created by me | sidebar link | 自分が作成 | なし | 高 / 対応 |
| Issues | Recent activity | sidebar link | 最近の更新 | なし | 高 / 対応 |
| Issues | Milestones / Labels | `/milestones` / `/labels` links | 目標 / 分類ラベル | あり | 高 / 対応 |
| Issues | New issue | `/issues/new/choose` link | 課題や相談を作成 | あり | 高 / 対応 |
| Issues | Search issues | form label / combobox | 課題と相談を検索 | あり | 高 / 対応 |
| Issues | Clear filter | form button | 検索条件を消す | なし | 中 / 対応 |
| Issues | Filter by author / Filter by labels | filter controls | 作成者で絞り込む / 分類ラベルで絞り込む | なし | 中 / 対応 |
| Issues | No results matched your search | Primer Blankslate heading | 検索に一致する項目がありません | なし | 高 / 対応 |
| Issues | Try a different search query. | Primer Blankslate description | 検索語を変えてみてください。 | なし | 高 / 対応 |
| Pull requests | Authored by me / Assigned to me / Involves me | sidebar links | 自分が提案 / 自分が担当 / 自分が関わる | あり | 高 / 対応 |
| Pull requests | Review requests | sidebar link | レビュー依頼 | あり | 高 / 対応 |
| Pull requests | Milestones / Labels | scoped links | 目標 / 分類ラベル | あり | 高 / 対応 |
| Pull requests | New pull request | `/compare` link | 変更を提案 | あり | 高 / 対応 |
| Pull requests | Search pull requests | form label / combobox | 変更の提案を検索 | あり | 高 / 対応 |
| Pull requests | No pull requests matched your search | Primer Blankslate heading | 検索に一致する変更の提案はありません | あり | 高 / 対応 |
| Pull requests | Try a different search query. | Primer Blankslate description | 検索語を変えてみてください。 | なし | 高 / 対応 |
| Actions | New workflow | `/actions/new` link | 新しい自動処理 | あり | 高 / 対応 |
| Actions | Management | sidebar heading | 管理 | なし | 高 / 対応 |
| Actions | Caches / Runners | sidebar links | キャッシュ / 実行環境 | あり | 中 / 対応 |
| Actions | Usage metrics / Performance metrics | sidebar links | 利用状況 / 性能指標 | なし | 中 / 対応 |
| Actions | All workflows | sidebar link / heading | すべての自動処理 | あり | 高 / 対応 |
| Actions | Workflow / Event / Status / Actor | filter labels | 自動処理 / 開始条件 / 状態 / 実行した人 | あり | 中 / 対応 |
| Actions | Filter workflow runs | filter control | 実行履歴を絞り込む | あり | 高 / 対応 |
| Actions | Showing runs from all workflows | result summary | すべての自動処理の実行履歴を表示中 | あり | 高 / 対応 |
| Actions | Attestations | sidebar link | 証明情報 | あり | 低 / 保留：機能説明を要検討 |
| Actions | Actions: haruka-ds/github-ja-ui | composite heading | 自動処理: 識別子 | あり | 低 / 保留：識別子混在 |
| Actions | 8 workflow runs | dynamic count | 8 件の実行 | あり | 低 / 保留：可変値 |
| Projects | Link a project | popup button | 作業計画を関連付ける | あり | 高 / 対応 |
| Projects | Search projects / Search by name… | form label / placeholder | 作業計画を検索 / 名前で検索… | あり | 高 / 対応 |
| Projects | Repository projects | heading | このリポジトリの作業計画 | あり | 高 / 対応 |
| Projects | No projects found | Primer Blankslate heading | 作業計画が見つかりません | あり | 高 / 対応 |
| Projects | There are no projects linked to this repository yet. | Primer Blankslate description | このリポジトリに関連付けられた作業計画はまだありません。 | あり | 高 / 対応 |
| Projects | Recently updated | sort option | 最近更新した順 | なし | 中 / 対応 |
| Settings | Access / Code, planning, and automation / Integrations / Archives | navigation headings | 利用権限 / コード・計画・自動処理 / 連携 / 記録 | あり | 高 / 対応 |
| Settings | Company / Location / Display current local time | form labels | 所属 / 所在地 / 現在の現地時刻を表示 | なし | 高 / 対応 |
| Settings | Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time. | official form help | 名前は参加した場所や言及された場所に表示されることがあります。いつでも削除できます。 | なし | 高 / 対応 |
| Settings | Other users will see the time difference from their local time. | official form help | ほかの人には、その人の現地時間との差が表示されます。 | なし | 高 / 対応 |
| Settings | Tell us a little bit about yourself | textarea placeholder | 自己紹介を入力 | なし | 高 / 対応。入力値は対象外 |
| Settings | Update profile / Update preferences | buttons | プロフィールを更新 / 設定を更新 | なし | 高 / 対応 |
| Settings | Contributions & activity / Profile settings / Jobs profile / Trending settings | headings | 参加履歴と活動 / プロフィール設定 / 仕事用プロフィール / 人気リポジトリの設定 | あり | 高 / 対応 |
| Settings | Preferred spoken language / Save jobs profile / Save Trending settings | label / buttons | 優先する言語 / 仕事用プロフィールを保存 / 人気リポジトリの設定を保存 | なし | 中 / 対応 |
| Settings | haruka-ds (haruka-ds) settings | composite heading | アカウント設定 | なし | 低 / 保留：username 混在 |
| Settings | ORCID・privacy・consent の長文 | official help + links | 内容ごとに確認 | なし | 低 / 保留：法的意味とリンク境界 |
| Search | Filter by / Languages / Advanced / Users | sidebar headings / links | 絞り込み条件 / 使用言語 / 詳細条件 / ユーザー | なし | 高 / 対応 |
| Search | More languages... | button | ほかの言語… | なし | 高 / 対応 |
| Search | Owner / Size / Number of followers / Number of forks / Number of stars | advanced filters | 所有者 / サイズ / フォロワー数 / コピーされた数 / お気に入り登録数 | あり | 中 / 対応 |
| Search | Date created / Date pushed | advanced filters | 作成日 / 最終更新日 | なし | 中 / 対応 |
| Search | Sort by: Best match | sort button | 並べ替え: 関連度順 | なし | 高 / 対応 |
| Search | repositories Search Results · github-ja-ui / 49 results | query + count | 検索結果 | なし | 低 / 保留：query・数値混在 |
| Profile | Overview / Repositories (8) / Projects / Packages / Stars | `nav[aria-label="User"]` links | 概要 / リポジトリ一覧 / 作業計画 / パッケージ / 保存した項目 | あり | 高 / 対応。数値は維持 |
| Profile | Set status / Edit profile / Customize your pins | buttons | 状態を設定 / プロフィールを編集 / 固定表示を編集 | なし | 高 / 対応 |
| Profile | Popular repositories | heading | よく見られるリポジトリ | なし | 高 / 対応 |
| Profile | Contribution settings | button | 参加履歴の設定 | なし | 中 / 対応 |
| Profile | 19 contributions in the last year | dynamic count | 昨年の参加履歴 | あり | 低 / 保留：可変値 |
| Notifications | Notification settings | dynamic menuitem link | 通知の設定 | なし | 高 / 対応 |
| Notifications | 実通知のタイトル・本文 | user-authored content | 原形維持 | 対象外 | 低 / 未確認：受信箱が空 |

`Code` と `All repositories` は辞書不足ではなく、前者は翻訳済み navigation の aria-label を信頼判定が認めず、後者は `aria-hidden` の tooltip が icon link の `aria-labelledby` に使われている構造を判定できなかった。今回の処理は、完全一致の語と実サイトで観察したリンク先・要素の組合せに限定した。`innerHTML` 置換、任意の部分一致、保護対象の緩和はしていない。
