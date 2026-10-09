export type Term = {
  original: string;
  label: string;
  description?: string;
  contexts?: readonly (
    | 'home'
    | 'repository'
    | 'issues'
    | 'pulls'
    | 'actions'
    | 'projects'
    | 'settings'
    | 'search'
    | 'profile'
    | 'notifications'
  )[];
  surface?: 'page-copy' | 'empty-state' | 'form-label';
};

// Exact, context-independent UI strings only. User-authored text is filtered separately.
export const terms: readonly Term[] = [
  { original: 'Home', label: 'ホーム', contexts: ['home'] },
  { original: 'Dashboard', label: 'ホーム', contexts: ['home'] },
  { original: 'Feed', label: 'フィード', contexts: ['home'] },
  { original: 'All issues', label: 'すべての課題と相談', contexts: ['home'] },
  {
    original: 'All pull requests',
    label: 'すべての変更の提案',
    contexts: ['home'],
  },
  {
    original: 'No pull requests found, try a different filter.',
    label: '変更の提案は見つかりませんでした。絞り込みを変えてみてください。',
    contexts: ['home'],
    surface: 'page-copy',
  },
  {
    original: 'No issues found, try a different filter.',
    label: '課題と相談は見つかりませんでした。絞り込みを変えてみてください。',
    contexts: ['home'],
    surface: 'page-copy',
  },
  {
    original: 'Ask anything or type @ to add context',
    label: '質問を入力。@ で関連情報を追加できます',
    contexts: ['home'],
  },
  {
    original: 'Agent sessions',
    label: 'AI に依頼した作業',
    contexts: ['home'],
  },
  { original: 'Chat commands', label: 'AI への依頼', contexts: ['home'] },
  {
    original: 'Top repositories',
    label: 'よく使うリポジトリ',
    contexts: ['home'],
  },
  {
    original: 'All repositories',
    label: 'すべてのリポジトリ',
    contexts: ['home'],
  },
  {
    original: 'Latest from our changelog',
    label: 'GitHub の最近の更新',
    contexts: ['home'],
  },
  { original: 'Ask', label: '質問する', contexts: ['home'] },
  { original: 'Debug', label: '問題を調べる', contexts: ['home'] },
  { original: 'Agent', label: 'AI に作業を頼む', contexts: ['home'] },
  { original: 'Create issue', label: '課題や相談を作成', contexts: ['home'] },
  { original: 'Write code', label: 'コードを書く', contexts: ['home'] },
  {
    original: 'Git',
    label: 'Git',
    contexts: ['home'],
    description: 'ファイルの変更履歴を記録・管理する仕組みです。',
  },
  { original: 'Show more', label: 'もっと見る', contexts: ['home'] },
  { original: 'Marketplace', label: 'ツールを探す', contexts: ['home'] },
  {
    original: 'MCP registry',
    label: 'MCP registry',
    contexts: ['home'],
    description: 'AI に追加できる機能を探す場所です。MCP は接続の規格名です。',
  },
  { original: 'Explore', label: '探す' },
  { original: 'Search', label: '検索' },
  { original: 'Advanced search', label: '詳細検索' },
  { original: 'Repositories', label: 'リポジトリ一覧' },
  { original: 'Repository', label: 'リポジトリ' },
  { original: 'Your repositories', label: '自分のリポジトリ' },
  { original: 'Your profile', label: 'プロフィール' },
  { original: 'Your stars', label: '保存したリポジトリ' },
  { original: 'Your gists', label: '自分の Gist' },
  { original: 'Overview', label: '概要' },
  { original: 'Follow', label: 'フォローする' },
  { original: 'Unfollow', label: 'フォローを解除' },
  { original: 'Stars', label: '保存した項目' },
  { original: 'Settings', label: '設定', contexts: ['settings'] },
  {
    original: 'Public profile',
    label: '公開プロフィール',
    contexts: ['settings'],
  },
  { original: 'Account', label: 'アカウント', contexts: ['settings'] },
  { original: 'Appearance', label: '表示', contexts: ['settings'] },
  {
    original: 'Accessibility',
    label: 'アクセシビリティ',
    contexts: ['settings'],
  },
  {
    original: 'Billing and licensing',
    label: '請求とライセンス',
    contexts: ['settings'],
  },
  { original: 'Emails', label: 'メールアドレス', contexts: ['settings'] },
  {
    original: 'Password and authentication',
    label: 'パスワードと認証',
    contexts: ['settings'],
  },
  { original: 'Sessions', label: 'ログイン中の端末', contexts: ['settings'] },
  {
    original: 'SSH and GPG keys',
    label: 'SSH・GPG キー',
    contexts: ['settings'],
  },
  { original: 'Credentials', label: '認証情報', contexts: ['settings'] },
  { original: 'Organizations', label: '組織', contexts: ['settings'] },
  { original: 'Enterprises', label: '企業アカウント', contexts: ['settings'] },
  { original: 'Moderation', label: '管理と制限', contexts: ['settings'] },
  {
    original: 'Codespaces',
    label: 'Codespaces',
    contexts: ['home', 'settings'],
    description: 'ブラウザから使える GitHub の開発環境です。',
  },
  {
    original: 'Packages',
    label: 'パッケージ',
    contexts: ['settings', 'repository', 'profile'],
  },
  {
    original: 'Copilot',
    label: 'Copilot',
    contexts: ['home', 'settings'],
    description: 'GitHub の AI アシスタントです。',
  },
  { original: 'Pages', label: 'Web ページ公開', contexts: ['settings'] },
  { original: 'Name', label: '名前', contexts: ['settings'] },
  {
    original: 'Profile picture',
    label: 'プロフィール画像',
    contexts: ['settings'],
  },
  {
    original: 'Public email',
    label: '公開メールアドレス',
    contexts: ['settings'],
  },
  { original: 'Bio', label: '自己紹介', contexts: ['settings'] },
  { original: 'Pronouns', label: '代名詞', contexts: ['settings'] },
  {
    original: 'Social accounts',
    label: 'SNS アカウント',
    contexts: ['settings'],
  },
  { original: 'Sign out', label: 'ログアウト' },
  {
    original: 'Notifications',
    label: '通知',
    contexts: ['notifications', 'settings'],
  },
  { original: 'Inbox', label: '受信箱', contexts: ['notifications'] },
  { original: 'Done', label: '完了', contexts: ['notifications'] },
  { original: 'Saved', label: '保存済み', contexts: ['notifications'] },
  { original: 'All', label: 'すべて', contexts: ['notifications'] },
  { original: 'Unread', label: '未読', contexts: ['notifications'] },
  {
    original: 'Search notifications',
    label: '通知を検索',
    contexts: ['notifications'],
    surface: 'page-copy',
  },
  {
    original: 'Notification filters',
    label: '通知の絞り込み',
    contexts: ['notifications'],
    surface: 'page-copy',
  },
  { original: 'Sort by', label: '並べ替え', contexts: ['notifications'] },
  { original: 'Group by', label: 'グループ分け', contexts: ['notifications'] },
  { original: 'Assigned', label: '自分が担当', contexts: ['notifications'] },
  { original: 'Participating', label: '参加中', contexts: ['notifications'] },
  { original: 'Mentioned', label: '自分への言及', contexts: ['notifications'] },
  {
    original: 'Team mentioned',
    label: 'チームへの言及',
    contexts: ['notifications'],
  },
  {
    original: 'Review requested',
    label: 'レビュー依頼',
    contexts: ['notifications'],
  },
  {
    original: 'Manage notifications',
    label: '通知を管理',
    contexts: ['notifications'],
  },
  { original: 'Dismiss', label: '閉じる', contexts: ['notifications'] },
  { original: 'Get started', label: '使い始める', contexts: ['notifications'] },
  { original: 'Folders', label: 'フォルダー', contexts: ['notifications'] },
  {
    original: 'Customize filters',
    label: '絞り込みをカスタマイズ',
    contexts: ['notifications'],
  },
  {
    original: 'Add new filter',
    label: '絞り込みを追加',
    contexts: ['notifications'],
  },
  {
    original: 'Clear out the clutter.',
    label: '通知を整理しましょう。',
    contexts: ['notifications'],
  },
  {
    original:
      'Get the most out of your new inbox by quickly and easily marking all of your previously read notifications as done.',
    label: '既読の通知をまとめて完了にすると、受信箱を整理できます。',
    contexts: ['notifications'],
    surface: 'page-copy',
  },
  {
    original: 'Get started clearing your notifications',
    label: '通知の整理を始める',
    contexts: ['notifications'],
  },
  {
    original: 'Notifications by date',
    label: '日付別の通知',
    contexts: ['notifications'],
  },
  {
    original: 'Take a break, write some code, do what you do best.',
    label: 'ひと息ついて、自分の作業に集中しましょう。',
    contexts: ['notifications'],
    surface: 'page-copy',
  },
  {
    original: 'All caught up!',
    label: '新しい通知はありません',
    contexts: ['notifications'],
  },
  { original: 'New', label: '新規作成' },
  { original: 'Create', label: '作成' },
  { original: 'Cancel', label: 'キャンセル' },
  { original: 'Close', label: '閉じる' },
  { original: 'Save', label: '保存' },
  { original: 'Save changes', label: '変更を保存' },
  { original: 'Delete', label: '削除' },
  { original: 'Edit', label: '編集' },
  { original: 'Preview', label: 'プレビュー' },
  { original: 'Submit', label: '送信' },
  { original: 'Filter', label: '絞り込み' },
  { original: 'Filters', label: '絞り込み' },
  { original: 'Sort', label: '並べ替え' },
  { original: 'Clear', label: 'クリア' },
  { original: 'Clear all', label: 'すべてクリア' },
  { original: 'Apply', label: '適用' },
  { original: 'Next', label: '次へ' },
  { original: 'Previous', label: '前へ' },
  { original: 'Learn more', label: '詳しく見る' },
  { original: 'View all', label: 'すべて見る', contexts: ['home'] },
  { original: 'Code', label: 'コード' },
  {
    original: 'Issues',
    label: '課題と相談',
    contexts: ['home', 'issues'],
    description:
      '不具合の報告や作業の相談をまとめる場所です。GitHub では Issues と呼びます。',
  },
  {
    original: 'Pull requests',
    label: '変更の提案',
    contexts: ['home', 'pulls'],
    description:
      '変更を取り込んでもらうための提案です。GitHub では Pull request と呼びます。',
  },
  {
    original: 'Actions',
    label: '自動処理',
    contexts: ['actions'],
    description:
      'テストや公開などの作業を自動で実行する機能です。GitHub では Actions と呼びます。',
  },
  {
    original: 'Projects',
    label: '作業計画',
    contexts: ['projects'],
    description:
      '課題や作業の進み具合を整理する場所です。GitHub では Projects と呼びます。',
  },
  { original: 'Wiki', label: 'Wiki' },
  { original: 'Security', label: 'セキュリティ' },
  { original: 'Insights', label: '分析' },
  {
    original: 'Discussions',
    label: '話し合い',
    description: '質問やアイデアを共有して話し合う場所です。',
  },
  {
    original: 'Fork',
    label: '自分用にコピー',
    description:
      'このリポジトリを自分のアカウントに複製します。GitHub では Fork と呼びます。',
  },
  {
    original: 'Star',
    label: 'お気に入りに保存',
    description:
      '後で見つけやすいよう、このリポジトリを保存します。GitHub では Star と呼びます。',
  },
  { original: 'Unstar', label: 'お気に入りを解除' },
  {
    original: 'Watch',
    label: '更新を通知',
    description:
      'このリポジトリの更新通知を受け取ります。GitHub では Watch と呼びます。',
  },
  { original: 'Unwatch', label: '通知を停止' },
  {
    original: 'Clone',
    label: '手元にコピー',
    description:
      'ファイルと変更履歴を自分のパソコンに複製します。GitHub では Clone と呼びます。',
  },
  { original: 'Download ZIP', label: 'ZIP でダウンロード' },
  { original: 'Create a new repository', label: '新しいリポジトリを作成' },
  { original: 'New repository', label: '新しいリポジトリ' },
  {
    original: 'Add file',
    label: 'ファイルを追加',
    contexts: ['repository'],
  },
  { original: 'Create new file', label: '新しいファイルを作成' },
  { original: 'Upload files', label: 'ファイルをアップロード' },
  { original: 'Go to file', label: 'ファイルを探す' },
  { original: 'History', label: '変更履歴', contexts: ['repository'] },
  {
    original: 'Commits',
    label: '変更履歴',
    description: '保存された変更の記録です。GitHub では Commit と呼びます。',
  },
  {
    original: 'Commit changes',
    label: '変更を記録',
    description: '変更を履歴として保存します。GitHub では Commit と呼びます。',
  },
  {
    original: 'Branches',
    label: '作業の分岐',
    description:
      '別の作業を並行して進めるための分岐です。GitHub では Branch と呼びます。',
  },
  {
    original: 'Branch',
    label: '作業の分岐',
    description:
      '変更を分けて進めるための作業線です。GitHub では Branch と呼びます。',
  },
  { original: 'Tags', label: 'タグ' },
  { original: 'Releases', label: '公開版', contexts: ['repository'] },
  { original: 'Compare', label: '変更を比較' },
  {
    original: 'Merge',
    label: '変更を統合',
    description:
      '別々に進めた変更を一つにまとめます。GitHub では Merge と呼びます。',
  },
  {
    original: 'Merge pull request',
    label: '提案された変更を統合',
    description: 'この変更の提案を取り込みます。GitHub では Merge と呼びます。',
  },
  { original: 'New issue', label: '課題や相談を作成' },
  { original: 'New pull request', label: '変更を提案' },
  { original: 'Open', label: '対応中' },
  { original: 'Closed', label: '終了' },
  { original: 'Merged', label: '統合済み' },
  { original: 'Labels', label: '分類ラベル' },
  { original: 'Milestones', label: '目標' },
  { original: 'Assignees', label: '担当者' },
  { original: 'Reviewers', label: '確認担当者' },
  { original: 'Review changes', label: '変更を確認' },
  { original: 'Files changed', label: '変更されたファイル' },
  { original: 'Checks', label: '自動確認' },
  { original: 'Conversation', label: 'やり取り' },
  { original: 'Subscribe', label: '通知を受け取る' },
  { original: 'Unsubscribe', label: '通知を停止' },
  { original: 'General', label: '一般' },
  { original: 'Collaborators', label: '共同作業者' },
  { original: 'Webhooks', label: 'Webhook' },
  { original: 'Secrets and variables', label: '秘密情報と変数' },
  { original: 'Manage access', label: 'アクセス権を管理' },
  { original: 'Public', label: '公開' },
  { original: 'Private', label: '非公開' },
  { original: 'Workflow runs', label: '自動処理の実行履歴' },
  { original: 'Run workflow', label: '自動処理を実行' },
  {
    original: 'All workflows',
    label: 'すべての自動処理',
    contexts: ['actions'],
  },
  { original: 'New project', label: '新しい作業計画' },
  { original: 'All notifications', label: 'すべての通知' },
  { original: 'Mark as done', label: '確認済みにする' },
  // Labels observed in the signed-in GitHub UI on 2026-10-09. Each value is
  // exact; route, control, link destination, and prose checks gate its use.
  { original: 'Open menu', label: 'メニューを開く' },
  {
    original: 'Open quick search dialog, type / to search ( forward slash )',
    label: '検索を開く（/）',
  },
  { original: 'Create new...', label: '新しく作成' },
  { original: 'Open user navigation menu', label: 'ユーザーメニューを開く' },
  {
    original: 'Search for repositories',
    label: 'リポジトリを探す',
    contexts: ['home'],
  },
  {
    original: 'Pull request options',
    label: '変更の提案の表示設定',
    contexts: ['home'],
  },
  {
    original: 'Issue options',
    label: '課題と相談の表示設定',
    contexts: ['home'],
  },
  { original: 'More items', label: 'その他' },
  { original: 'Latest commit', label: '最新の変更', contexts: ['repository'] },
  {
    original: 'Folders and files',
    label: 'フォルダーとファイル',
    contexts: ['repository'],
  },
  { original: 'About', label: '概要', contexts: ['repository'] },
  { original: 'Contributors', label: '参加者', contexts: ['repository'] },
  {
    original: 'Languages',
    label: '使用言語',
    contexts: ['repository', 'search'],
  },
  { original: 'Go to Branches page', label: '作業の分岐を見る' },
  { original: 'Go to Tags page', label: 'タグを見る' },
  { original: 'Assigned to me', label: '自分が担当' },
  { original: 'Created by me', label: '自分が作成' },
  { original: 'Recent activity', label: '最近の更新' },
  {
    original: 'Search issues',
    label: '課題と相談を検索',
    contexts: ['issues'],
    surface: 'form-label',
  },
  { original: 'Clear filter', label: '検索条件を消す' },
  { original: 'Filter by author', label: '作成者で絞り込む' },
  { original: 'Filter by labels', label: '分類ラベルで絞り込む' },
  { original: 'Filter by label', label: '分類ラベルで絞り込む' },
  {
    original: 'No results matched your search',
    label: '検索に一致する項目がありません',
    contexts: ['issues'],
    surface: 'empty-state',
  },
  {
    original: 'Try a different search query.',
    label: '検索語を変えてみてください。',
    contexts: ['issues', 'pulls'],
    surface: 'empty-state',
  },
  { original: 'Authored by me', label: '自分が提案' },
  { original: 'Involves me', label: '自分が関わる' },
  { original: 'Review requests', label: 'レビュー依頼' },
  {
    original: 'Search pull requests',
    label: '変更の提案を検索',
    contexts: ['pulls'],
    surface: 'form-label',
  },
  {
    original: 'No pull requests matched your search',
    label: '検索に一致する変更の提案はありません',
    contexts: ['pulls'],
    surface: 'empty-state',
  },
  { original: 'New workflow', label: '新しい自動処理' },
  { original: 'Management', label: '管理', contexts: ['actions'] },
  { original: 'Caches', label: 'キャッシュ' },
  { original: 'Runners', label: '実行環境' },
  { original: 'Usage metrics', label: '利用状況' },
  { original: 'Performance metrics', label: '性能指標' },
  { original: 'Workflow', label: '自動処理', contexts: ['actions'] },
  { original: 'Event', label: '開始条件', contexts: ['actions'] },
  { original: 'Status', label: '状態', contexts: ['actions'] },
  { original: 'Actor', label: '実行した人', contexts: ['actions'] },
  {
    original: 'Filter workflow runs',
    label: '実行履歴を絞り込む',
    contexts: ['actions'],
  },
  {
    original: 'Showing runs from all workflows',
    label: 'すべての自動処理の実行履歴を表示中',
    contexts: ['actions'],
    surface: 'page-copy',
  },
  { original: 'Link a project', label: '作業計画を関連付ける' },
  {
    original: 'Repository projects',
    label: 'このリポジトリの作業計画',
    contexts: ['projects'],
  },
  {
    original: 'Search projects',
    label: '作業計画を検索',
    contexts: ['projects'],
    surface: 'form-label',
  },
  {
    original: 'Search by name…',
    label: '名前で検索…',
    contexts: ['projects'],
  },
  {
    original: 'No projects found',
    label: '作業計画が見つかりません',
    contexts: ['projects'],
    surface: 'empty-state',
  },
  {
    original: 'There are no projects linked to this repository yet.',
    label: 'このリポジトリに関連付けられた作業計画はまだありません。',
    contexts: ['projects'],
    surface: 'empty-state',
  },
  { original: 'Recently updated', label: '最近更新した順' },
  { original: 'Access', label: '利用権限', contexts: ['settings'] },
  {
    original: 'Code, planning, and automation',
    label: 'コード・計画・自動処理',
    contexts: ['settings'],
  },
  { original: 'Integrations', label: '連携', contexts: ['settings'] },
  { original: 'Archives', label: '記録', contexts: ['settings'] },
  { original: 'Company', label: '所属', contexts: ['settings'] },
  { original: 'Location', label: '所在地', contexts: ['settings'] },
  {
    original: 'Tell us a little bit about yourself',
    label: '自己紹介を入力',
    contexts: ['settings'],
  },
  {
    original:
      'Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time.',
    label:
      '名前は、参加した場所や言及された場所に表示されることがあります。いつでも削除できます。',
    contexts: ['settings'],
    surface: 'page-copy',
  },
  {
    original: 'Other users will see the time difference from their local time.',
    label: 'ほかの人には、その人の現地時間との差が表示されます。',
    contexts: ['settings'],
    surface: 'page-copy',
  },
  { original: 'Display current local time', label: '現在の現地時刻を表示' },
  { original: 'Update profile', label: 'プロフィールを更新' },
  { original: 'Update preferences', label: '設定を更新' },
  {
    original: 'Contributions & activity',
    label: '参加履歴と活動',
    contexts: ['settings'],
  },
  {
    original: 'Profile settings',
    label: 'プロフィール設定',
    contexts: ['settings'],
  },
  {
    original: 'Jobs profile',
    label: '仕事用プロフィール',
    contexts: ['settings'],
  },
  {
    original: 'Trending settings',
    label: '人気リポジトリの設定',
    contexts: ['settings'],
  },
  {
    original: 'Preferred spoken language',
    label: '優先する言語',
    contexts: ['settings'],
  },
  { original: 'Save jobs profile', label: '仕事用プロフィールを保存' },
  { original: 'Save Trending settings', label: '人気リポジトリの設定を保存' },
  { original: 'Filter by', label: '絞り込み条件', contexts: ['search'] },
  { original: 'Advanced', label: '詳細条件', contexts: ['search'] },
  { original: 'Users', label: 'ユーザー', contexts: ['search'] },
  { original: 'More languages...', label: 'ほかの言語…', contexts: ['search'] },
  { original: 'Owner', label: '所有者', contexts: ['search'] },
  { original: 'Size', label: 'サイズ', contexts: ['search'] },
  {
    original: 'Number of followers',
    label: 'フォロワー数',
    contexts: ['search'],
  },
  {
    original: 'Number of forks',
    label: 'コピーされた数',
    contexts: ['search'],
  },
  {
    original: 'Number of stars',
    label: 'お気に入り登録数',
    contexts: ['search'],
  },
  { original: 'Date created', label: '作成日', contexts: ['search'] },
  { original: 'Date pushed', label: '最終更新日', contexts: ['search'] },
  {
    original: 'Sort by: Best match',
    label: '並べ替え: 関連度順',
    contexts: ['search'],
  },
  { original: 'Edit profile', label: 'プロフィールを編集' },
  { original: 'Customize your pins', label: '固定表示を編集' },
  { original: 'Set status', label: '状態を設定' },
  { original: 'Contribution settings', label: '参加履歴の設定' },
  {
    original: 'Popular repositories',
    label: 'よく見られるリポジトリ',
    contexts: ['profile'],
  },
  { original: 'Notification settings', label: '通知の設定' },
];

export const dictionary = new Map(terms.map((term) => [term.original, term]));

// A small, separately reviewed set of complete prose segments. Arbitrary
// Markdown is not sent to a service or assembled across element boundaries.
const contentTerms = new Map<string, Term>([
  ['Getting started', { original: 'Getting started', label: '使い始める' }],
  [
    'Learn how to use this project.',
    {
      original: 'Learn how to use this project.',
      label: 'このプロジェクトの使い方を確認しましょう。',
    },
  ],
]);

export function translateContent(value: string): Term | undefined {
  return contentTerms.get(value.trim().replace(/\s+/g, ' '));
}

export function translate(value: string): Term | undefined {
  const original = value.trim().replace(/\s+/g, ' ');
  const exact = dictionary.get(original);
  if (exact) return exact;
  const sort = /^Sort by: (Newest to oldest|Oldest to newest)$/.exec(original);
  if (sort)
    return {
      original,
      label: `並べ替え: ${sort[1] === 'Newest to oldest' ? '新しい順' : '古い順'}`,
      contexts: ['notifications'],
    };
  const group = /^Group by: (Date|Repository|None)$/.exec(original);
  if (group)
    return {
      original,
      label: `グループ分け: ${{ Date: '日付', Repository: 'リポジトリ', None: 'なし' }[group[1] as 'Date' | 'Repository' | 'None']}`,
      contexts: ['notifications'],
    };
  const greeting =
    /^(Good morning|Good afternoon|Good evening), ([A-Za-z0-9-]{1,39})!$/.exec(
      original,
    );
  if (!greeting) return undefined;
  const japanese =
    greeting[1] === 'Good morning'
      ? 'おはようございます'
      : greeting[1] === 'Good afternoon'
        ? 'こんにちは'
        : 'こんばんは';
  return {
    original,
    label: `${japanese}、${greeting[2]} さん！`,
    contexts: ['home'],
    surface: 'page-copy',
  };
}
