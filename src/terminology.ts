export type Term = {
  original: string;
  label: string;
  description?: string;
};

// Exact, context-independent UI strings only. User-authored text is filtered separately.
export const terms: readonly Term[] = [
  { original: 'Home', label: 'ホーム' },
  { original: 'Dashboard', label: 'ホーム' },
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
  { original: 'Settings', label: '設定' },
  { original: 'Sign out', label: 'ログアウト' },
  { original: 'Notifications', label: '通知' },
  { original: 'Inbox', label: '受信箱' },
  { original: 'Done', label: '完了' },
  { original: 'Saved', label: '保存済み' },
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
  { original: 'View all', label: 'すべて見る' },
  { original: 'Code', label: 'ファイル' },
  {
    original: 'Issues',
    label: '課題と相談',
    description:
      '不具合の報告や作業の相談をまとめる場所です。GitHub では Issues と呼びます。',
  },
  {
    original: 'Pull requests',
    label: '変更の提案',
    description:
      '変更を取り込んでもらうための提案です。GitHub では Pull request と呼びます。',
  },
  {
    original: 'Actions',
    label: '自動処理',
    description:
      'テストや公開などの作業を自動で実行する機能です。GitHub では Actions と呼びます。',
  },
  {
    original: 'Projects',
    label: '作業計画',
    description:
      '課題や作業の進み具合を整理する場所です。GitHub では Projects と呼びます。',
  },
  { original: 'Wiki', label: 'Wiki' },
  { original: 'Security', label: 'セキュリティ' },
  { original: 'Insights', label: '分析' },
  { original: 'Discussions', label: 'ディスカッション' },
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
  { original: 'Add file', label: 'ファイルを追加' },
  { original: 'Create new file', label: '新しいファイルを作成' },
  { original: 'Upload files', label: 'ファイルをアップロード' },
  { original: 'Go to file', label: 'ファイルを探す' },
  { original: 'History', label: '変更履歴' },
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
  { original: 'Releases', label: '公開版' },
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
  { original: 'All workflows', label: 'すべての自動処理' },
  { original: 'New project', label: '新しい作業計画' },
  { original: 'All notifications', label: 'すべての通知' },
  { original: 'Mark as done', label: '確認済みにする' },
];

export const dictionary = new Map(terms.map((term) => [term.original, term]));

export function translate(value: string): Term | undefined {
  return dictionary.get(value.trim());
}
