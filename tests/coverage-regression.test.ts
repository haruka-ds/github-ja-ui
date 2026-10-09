import { beforeEach, describe, expect, it } from 'vitest';
import { TranslationEngine } from '../src/engine';
import { observeUi } from '../src/observer';

type Case = { path: string; html: string; expected: Record<string, string> };

const cases: Case[] = [
  {
    path: '/',
    html: '<header><a data-component="IconButton" aria-labelledby="all-repos" href="/repos"></a><span id="all-repos" aria-hidden="true">All repositories</span><button class="prc-Button-IconButton" aria-labelledby="open-menu"></button><span id="open-menu" aria-hidden="true">Open menu</span></header><main><h1>Home</h1></main>',
    expected: {
      '#all-repos': 'すべてのリポジトリ',
      '#open-menu': 'メニューを開く',
    },
  },
  {
    path: '/haruka-ds/github-ja-ui',
    html: '<nav aria-label="リポジトリ"><a href="/haruka-ds/github-ja-ui">Code</a></nav><main><h2>Folders and files</h2><h2>Latest commit</h2><aside><h2>About</h2></aside><a href="/haruka-ds/github-ja-ui/tree/Code">Code</a></main>',
    expected: {
      'nav a': 'コード',
      'main h2': 'フォルダーとファイル',
      'main aside h2': '概要',
    },
  },
  {
    path: '/haruka-ds/github-ja-ui/issues',
    html: '<main><a href="/haruka-ds/github-ja-ui/issues/new/choose">New issue</a><a href="/haruka-ds/github-ja-ui/labels">Labels</a><label>Search issues</label><input placeholder="Search issues" value="is:issue state:open"><div class="prc-Blankslate-Blankslate"><h2 class="prc-Blankslate-Heading">No results matched your search</h2><p class="prc-Blankslate-Description">Try a different search query.</p></div><article><h2>New issue</h2></article></main>',
    expected: {
      'main > a': '課題や相談を作成',
      'main label': '課題と相談を検索',
      '.prc-Blankslate-Heading': '検索に一致する項目がありません',
    },
  },
  {
    path: '/haruka-ds/github-ja-ui/pulls',
    html: '<main><a href="/haruka-ds/github-ja-ui/compare">New pull request</a><label>Search pull requests</label><input placeholder="Search pull requests" value="is:pr state:open"><div class="prc-Blankslate-Blankslate"><h2>No pull requests matched your search</h2><p>Try a different search query.</p></div><article><h2>New pull request</h2></article></main>',
    expected: {
      'main > a': '変更を提案',
      'main label': '変更の提案を検索',
      '.prc-Blankslate-Blankslate h2': '検索に一致する変更の提案はありません',
    },
  },
  {
    path: '/haruka-ds/github-ja-ui/actions',
    html: '<main><h2>All workflows</h2><h3>Management</h3><a href="/haruka-ds/github-ja-ui/actions/new">New workflow</a><button>Filter workflow runs</button><p>Showing runs from all workflows</p><article><h2>All workflows</h2></article></main>',
    expected: {
      'main > h2': 'すべての自動処理',
      'main h3': '管理',
      'main > a': '新しい自動処理',
    },
  },
  {
    path: '/haruka-ds/github-ja-ui/projects',
    html: '<main><h2>Repository projects</h2><button>Link a project</button><label class="prc-FormControl-ControlVerticalLayout">Search projects</label><input placeholder="Search by name…" value="Projects"><div class="prc-Blankslate-Blankslate"><h2>No projects found</h2><p>There are no projects linked to this repository yet.</p></div><article><h2>Repository projects</h2></article></main>',
    expected: {
      'main > h2': 'このリポジトリの作業計画',
      'main button': '作業計画を関連付ける',
      '.prc-Blankslate-Blankslate h2': '作業計画が見つかりません',
    },
  },
  {
    path: '/settings/profile',
    html: '<main><h2>Access</h2><h2>Code, planning, and automation</h2><label>Company</label><p>Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time.</p><button>Update profile</button><input value="Issues" placeholder="Tell us a little bit about yourself"><article><h2>Access</h2></article></main>',
    expected: {
      'main > h2': '利用権限',
      'main label': '所属',
      'main > button': 'プロフィールを更新',
    },
  },
  {
    path: '/search',
    html: '<main><h2>Filter by</h2><h3>Languages</h3><button>Sort by: Best match</button><button>Number of stars</button><article><h2>Filter by</h2></article></main>',
    expected: {
      'main > h2': '絞り込み条件',
      'main h3': '使用言語',
      'main > button': '並べ替え: 関連度順',
    },
  },
  {
    path: '/haruka-ds',
    html: '<nav aria-label="User"><a href="/haruka-ds">Overview</a><a href="/haruka-ds?tab=projects">Projects</a></nav><main><button>Edit profile</button><h2>Popular repositories</h2><article><h2>Popular repositories</h2></article></main>',
    expected: {
      'nav a': '概要',
      'nav a:nth-child(2)': '作業計画',
      'main > h2': 'よく見られるリポジトリ',
    },
  },
  {
    path: '/notifications',
    html: '<main><div role="menu"><a href="/settings/notifications" role="menuitem">Notification settings</a></div><article><h2>Notification settings</h2></article></main>',
    expected: { '[role="menuitem"]': '通知の設定' },
  },
];

beforeEach(() => {
  document.body.innerHTML = '';
});

function nodeCount(root: Element): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
  let count = 1;
  while (walker.nextNode()) count += 1;
  return count;
}

describe.each(cases)(
  'actual-site UI shape: $path',
  ({ path, html, expected }) => {
    it('translates exact official UI, preserves content and topology, restores and reprocesses', () => {
      history.replaceState(null, '', path);
      document.body.innerHTML = `${html}<main id="guard"><a href="/haruka-ds/github-ja-ui/tree/main"><span data-testid="file-tree">Code</span></a><span data-testid="repository-name">Projects</span><span data-testid="branch-name">main</span><div class="markdown-body">Access</div><p>日本語の説明</p><input id="user-value" value="Settings"></main>`;
      const elements = [...document.body.querySelectorAll('*')];
      const nodes = nodeCount(document.body);
      const links = [...document.querySelectorAll('a')].map(
        (a) => [a, a.getAttribute('href'), a.parentNode] as const,
      );
      const engine = new TranslationEngine();
      engine.scan(document.body);
      for (const [selector, value] of Object.entries(expected))
        expect(document.querySelector(selector)?.textContent).toBe(value);
      expect(
        document.querySelector('[data-testid="file-tree"]')?.textContent,
      ).toBe('Code');
      expect(
        document.querySelector('[data-testid="repository-name"]')?.textContent,
      ).toBe('Projects');
      expect(document.querySelector('.markdown-body')?.textContent).toBe(
        'Access',
      );
      expect(document.querySelector('#guard p')?.textContent).toBe(
        '日本語の説明',
      );
      expect(
        (document.querySelector('#user-value') as HTMLInputElement).value,
      ).toBe('Settings');
      expect([...document.body.querySelectorAll('*')]).toEqual(elements);
      expect(nodeCount(document.body)).toBe(nodes);
      for (const [a, href, parent] of links) {
        expect(a.getAttribute('href')).toBe(href);
        expect(a.parentNode).toBe(parent);
      }
      const once = document.body.innerHTML;
      engine.scan(document.body);
      expect(document.body.innerHTML).toBe(once);
      engine.setEnabled(false);
      for (const [selector, value] of Object.entries(expected))
        expect(document.querySelector(selector)?.textContent).not.toBe(value);
      engine.setEnabled(true);
      engine.scan(document.body);
      for (const [selector, value] of Object.entries(expected))
        expect(document.querySelector(selector)?.textContent).toBe(value);
    });
  },
);

it('handles dynamically added route UI without altering input or links', async () => {
  history.replaceState(null, '', '/haruka-ds/github-ja-ui/projects');
  document.body.innerHTML = '<main><div id="target"></div></main>';
  const engine = new TranslationEngine();
  const stop = observeUi(engine);
  const button = document.createElement('button');
  button.textContent = 'Link a project';
  document.querySelector('#target')!.append(button);
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(button.textContent).toBe('作業計画を関連付ける');
  stop.disconnect();
});
