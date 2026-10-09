import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { TranslationEngine } from '../src/engine';
import { observeUi } from '../src/observer';

function fixture(name: 'home' | 'notifications' | 'settings'): string {
  return readFileSync(resolve('tests', 'fixtures', `${name}.html`), 'utf8');
}

function show(name: 'home' | 'notifications' | 'settings', path: string): void {
  history.replaceState(null, '', path);
  document.body.innerHTML = new DOMParser().parseFromString(
    fixture(name),
    'text/html',
  ).body.innerHTML;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('logged-in GitHub UI regression', () => {
  it('translates Home while preserving names and authored content', () => {
    show('home', '/');
    new TranslationEngine().scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('ホーム');
    expect(document.querySelector('#greeting')?.textContent).toBe(
      'こんにちは、haruka-ds さん！',
    );
    expect(document.querySelector('aside h2')?.textContent).toBe(
      'よく使うリポジトリ',
    );
    expect(document.querySelector('section h2')?.textContent).toBe('フィード');
    expect(document.querySelector('#no-pulls')?.textContent).toBe(
      '変更の提案は見つかりませんでした。絞り込みを変えてみてください。',
    );
    expect(document.querySelector('#no-issues')?.textContent).toBe(
      '課題と相談は見つかりませんでした。絞り込みを変えてみてください。',
    );
    expect(
      document.querySelector('#copilot-prompt')?.getAttribute('placeholder'),
    ).toBe('質問を入力。@ で関連情報を追加できます');
    expect(
      (document.querySelector('#copilot-prompt') as HTMLTextAreaElement).value,
    ).toBe('Issues');
    expect(document.querySelector('#git')?.textContent).toBe('Git');
    expect(document.querySelector('#git')?.getAttribute('title')).toContain(
      '変更履歴',
    );
    expect(document.querySelector('a[href="/pulls"]')?.textContent).toBe(
      '変更の提案',
    );
    expect(document.querySelector('#username')?.textContent).toBe('haruka-ds');
    expect(document.querySelector('#repo-name')?.textContent).toBe('Settings');
    expect(document.querySelector('#user-markdown')?.textContent?.trim()).toBe(
      'Settings Issues Pull requests',
    );
    expect(document.querySelector('#source-code')?.textContent?.trim()).toBe(
      'Dashboard',
    );
  });

  it('translates the expanded Home menu by its official destinations', () => {
    show('home', '/');
    new TranslationEngine().scan(document.body);
    const label = (path: string) =>
      document.querySelector(`#expanded-menu a[href="${path}"]`)?.textContent;
    expect(label('/feed')).toBe('フィード');
    expect(label('/issues')).toBe('すべての課題と相談');
    expect(label('/pulls')).toBe('すべての変更の提案');
    expect(label('/repos')).toBe('すべてのリポジトリ');
    expect(label('/projects')).toBe('作業計画');
    expect(label('/discussions')).toBe('話し合い');
    expect(label('/codespaces')).toBe('Codespaces');
    expect(
      document
        .querySelector('#expanded-menu a[href="/codespaces"]')
        ?.getAttribute('title'),
    ).toContain('開発環境');
    expect(label('/copilot')).toBe('Copilot');
    expect(
      document
        .querySelector('#expanded-menu a[href="/copilot"]')
        ?.getAttribute('title'),
    ).toContain('AI');
    expect(label('/marketplace')).toBe('ツールを探す');
    expect(label('/mcp')).toBe('MCP registry');
    expect(
      document
        .querySelector('#expanded-menu a[href="/mcp"]')
        ?.getAttribute('title'),
    ).toContain('AI');
    expect(document.querySelector('#expanded-menu button')?.textContent).toBe(
      'もっと見る',
    );
    expect(document.querySelector('#menu-repository')?.textContent).toBe(
      'Feed',
    );
  });

  it('translates Notifications while preserving input and notification subjects', () => {
    show('notifications', '/notifications');
    new TranslationEngine().scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('通知');
    expect(
      document.querySelector('a[href="/notifications"]')?.textContent,
    ).toBe('通知');
    expect(document.querySelector('nav a')?.textContent).toBe('受信箱');
    expect(document.querySelector('button')?.textContent).toBe('すべて');
    expect(document.querySelector('#search-label')?.textContent).toBe(
      '通知を検索',
    );
    expect(
      document
        .querySelector('#notification-search')
        ?.getAttribute('placeholder'),
    ).toBe('通知を検索');
    expect(
      document
        .querySelector('#notification-search')
        ?.getAttribute('aria-label'),
    ).toBe('通知を検索');
    expect(
      (document.querySelector('#notification-search') as HTMLInputElement)
        .value,
    ).toBe('Issues');
    expect(document.querySelector('h2')?.textContent).toBe(
      '通知を整理しましょう。',
    );
    expect(document.querySelector('#sort')?.textContent?.trim()).toBe(
      '並べ替え: 新しい順',
    );
    expect(document.querySelector('#group')?.textContent?.trim()).toBe(
      'グループ分け: 日付',
    );
    expect(
      [...document.querySelectorAll('#sort-options button')].map((button) =>
        button.textContent?.trim(),
      ),
    ).toEqual(['新しい順', '古い順']);
    expect(
      [...document.querySelectorAll('#group-options button')].map((button) =>
        button.textContent?.trim(),
      ),
    ).toEqual(['リポジトリ', '日付']);
    expect(document.querySelector('#clutter-copy')?.textContent?.trim()).toBe(
      '既読の通知をまとめて完了にすると、受信箱を整理できます。',
    );
    expect(document.querySelector('#inbox-copy')?.textContent).toBe(
      'ひと息ついて、自分の作業に集中しましょう。',
    );
    expect(
      document
        .querySelector('button[aria-label="絞り込みをカスタマイズ"]')
        ?.getAttribute('title'),
    ).toBe('絞り込みを追加');
    expect(document.querySelector('#notification-subject')?.textContent).toBe(
      'Settings',
    );
    expect(document.querySelector('#user-comment')?.textContent?.trim()).toBe(
      'Notifications',
    );
    expect(document.querySelector('#username')?.textContent).toBe('haruka-ds');
  });

  it('translates Settings while preserving form values and repository names', () => {
    show('settings', '/settings/profile');
    new TranslationEngine().scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('設定');
    expect(document.querySelector('aside a')?.textContent).toBe(
      '公開プロフィール',
    );
    expect(document.querySelector('section h2')?.textContent).toBe(
      '公開プロフィール',
    );
    expect(document.querySelector('label[for="name"]')?.textContent).toBe(
      '名前',
    );
    expect(document.querySelector('label[for="bio"]')?.textContent).toBe(
      '自己紹介',
    );
    expect(document.querySelector('#name')?.getAttribute('placeholder')).toBe(
      '名前',
    );
    expect((document.querySelector('#name') as HTMLInputElement).value).toBe(
      'Issues',
    );
    expect((document.querySelector('#bio') as HTMLTextAreaElement).value).toBe(
      'Pull requests',
    );
    expect(document.querySelector('#repo-name')?.textContent).toBe('Settings');
    expect(document.querySelector('#user-markdown')?.textContent?.trim()).toBe(
      'Settings',
    );
    expect(document.querySelector('#username')?.textContent).toBe('haruka-ds');
  });

  it('restores and reapplies translated UI across OFF and ON', () => {
    show('settings', '/settings/profile');
    const engine = new TranslationEngine();
    engine.scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('設定');
    engine.setEnabled(false);
    expect(document.querySelector('h1')?.textContent).toBe('Settings');
    expect(document.querySelector('#name')?.getAttribute('placeholder')).toBe(
      'Name',
    );
    engine.setEnabled(true);
    engine.scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('設定');
    expect(document.querySelector('#name')?.getAttribute('placeholder')).toBe(
      '名前',
    );
  });

  it('translates a newly inserted page after SPA navigation', async () => {
    show('home', '/');
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    expect(document.querySelector('h1')?.textContent).toBe('ホーム');
    show('notifications', '/notifications');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('h1')?.textContent).toBe('通知');
    show('settings', '/settings/profile');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('h1')?.textContent).toBe('設定');
    observer.disconnect();
  });

  it('handles existing open shadow roots without crossing a protected host', () => {
    history.replaceState(null, '', '/settings/profile');
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML =
      '<main><h1>Settings</h1></main>';
    document.body.append(host);
    const protectedHost = document.createElement('div');
    protectedHost.className = 'markdown-body';
    protectedHost.attachShadow({ mode: 'open' }).innerHTML =
      '<main><h1>Settings</h1></main>';
    document.body.append(protectedHost);
    const observer = observeUi(new TranslationEngine(), document.body);
    expect(host.shadowRoot?.querySelector('h1')?.textContent).toBe('設定');
    expect(protectedHost.shadowRoot?.querySelector('h1')?.textContent).toBe(
      'Settings',
    );
    observer.disconnect();
  });

  it('never translates an authored article heading that matches a UI term', () => {
    show('home', '/');
    const article = document.createElement('article');
    article.innerHTML = '<h2>Home</h2><button>Issues</button>';
    document.body.append(article);
    new TranslationEngine().scan(document.body);
    expect(article.querySelector('h2')?.textContent).toBe('Home');
    expect(article.querySelector('button')?.textContent).toBe('Issues');
  });

  it('protects authored phrases and changes variable controls after a mutation', async () => {
    show('notifications', '/notifications');
    const article = document.createElement('article');
    article.innerHTML =
      '<p>Clear out the clutter.</p><p>Take a break, write some code, do what you do best.</p><button>Sort by: Newest to oldest</button>';
    document.body.append(article);
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    expect(article.textContent).toContain('Clear out the clutter.');
    expect(article.textContent).toContain('Sort by: Newest to oldest');
    const sort = document.querySelector('#sort')!;
    sort.textContent = 'Sort by: Oldest to newest';
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(sort.textContent).toBe('並べ替え: 古い順');
    engine.setEnabled(false);
    expect(sort.textContent).toBe('Sort by: Oldest to newest');
    observer.disconnect();
  });

  it('translates newly opened notification choices and restores their exact text', async () => {
    show('notifications', '/notifications');
    document.querySelector('#sort-options')?.remove();
    document.querySelector('#group-options')?.remove();
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menu');
    menu.innerHTML =
      '<li role="none"><form role="none" action="/notifications/beta/update_sort_order"><button role="menuitemradio"><span>Oldest to newest</span></button></form></li>' +
      '<li role="none"><form role="none" action="/notifications/beta/update_view_preference"><button role="menuitemradio"><span>Date</span></button></form></li>';
    document.querySelector('main')?.append(menu);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const choices = [...menu.querySelectorAll('button')];
    expect(choices.map((choice) => choice.textContent)).toEqual([
      '古い順',
      '日付',
    ]);
    engine.setEnabled(false);
    expect(choices.map((choice) => choice.textContent)).toEqual([
      'Oldest to newest',
      'Date',
    ]);
    engine.setEnabled(true);
    engine.scan(menu);
    expect(choices.map((choice) => choice.textContent)).toEqual([
      '古い順',
      '日付',
    ]);
    expect(choices[0]?.getAttribute('title')).toBeNull();
    observer.disconnect();
  });
});
