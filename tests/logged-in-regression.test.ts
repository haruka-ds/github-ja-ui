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
      'こんばんは、haruka-ds さん！',
    );
    expect(document.querySelector('aside h2')?.textContent).toBe(
      'よく使うリポジトリ',
    );
    expect(document.querySelector('section h2')?.textContent).toBe('フィード');
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

  it('translates Notifications while preserving input and notification subjects', () => {
    show('notifications', '/notifications');
    new TranslationEngine().scan(document.body);
    expect(document.querySelector('h1')?.textContent).toBe('通知');
    expect(
      document.querySelector('a[href="/notifications"]')?.textContent,
    ).toBe('通知');
    expect(document.querySelector('nav a')?.textContent).toBe('受信箱');
    expect(document.querySelector('button')?.textContent).toBe('すべて');
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
      '新しい通知はありません',
    );
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
});
