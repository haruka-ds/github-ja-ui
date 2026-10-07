import { beforeEach, describe, expect, it } from 'vitest';
import { TranslationEngine } from '../src/engine';
import { observeUi } from '../src/observer';
import { isProtectedElement } from '../src/protection';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('translation engine', () => {
  it('translates controls and adds a short explanation without replacing elements', () => {
    document.body.innerHTML =
      '<button id="fork">Fork</button><nav><a href="/example/project/issues">Issues</a></nav>';
    const button = document.querySelector('#fork')!;
    const engine = new TranslationEngine();
    engine.scan(document.body);
    expect(document.querySelector('#fork')).toBe(button);
    expect(button.textContent).toBe('自分用にコピー');
    expect(button.getAttribute('title')).toContain('Fork');
    expect(document.querySelector('nav a')?.textContent).toBe('課題と相談');
  });

  it('protects user content, names, editing fields and unknown strings', () => {
    document.body.innerHTML = `
      <header><a href="/Fork">Fork</a></header>
      <div class="markdown-body">Issues <code>Fork</code></div>
      <div class="comment-body"><button>Fork</button></div>
      <div class="js-issue-title">Actions</div>
      <div class="commit-message">Merge</div>
      <input value="Fork" aria-label="Fork"><textarea>Settings</textarea>
      <div contenteditable="true">Search</div>
      <button>My unique action</button>`;
    const original = document.body.innerHTML;
    const engine = new TranslationEngine();
    engine.scan(document.body);
    expect(document.body.innerHTML).toBe(original);
    expect(isProtectedElement(document.querySelector('.markdown-body')!)).toBe(
      true,
    );
  });

  it('is idempotent and restores the original UI on OFF', () => {
    document.body.innerHTML =
      '<button title="Settings" aria-label="Fork">Fork</button>';
    const engine = new TranslationEngine();
    engine.scan(document.body);
    const once = document.body.innerHTML;
    engine.scan(document.body);
    expect(document.body.innerHTML).toBe(once);
    engine.setEnabled(false);
    expect(document.body.innerHTML).toBe(
      '<button title="Settings" aria-label="Fork">Fork</button>',
    );
    engine.scan(document.body);
    expect(document.body.textContent).toBe('Fork');
    engine.setEnabled(true);
    engine.scan(document.body);
    expect(document.body.textContent).toBe('自分用にコピー');
  });

  it('keeps the original concept in accessible labels and existing tooltips', () => {
    document.body.innerHTML =
      '<button title="Fork" aria-label="Fork">Fork</button>';
    const engine = new TranslationEngine();
    engine.scan(document.body);
    const button = document.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toContain('Fork');
    expect(button.getAttribute('title')).toContain(
      'このリポジトリを自分のアカウントに複製',
    );
  });

  it('does not overwrite a GitHub update when restoring', () => {
    document.body.innerHTML = '<button>Fork</button>';
    const engine = new TranslationEngine();
    engine.scan(document.body);
    document.querySelector('button')!.textContent = 'Updated by GitHub';
    engine.setEnabled(false);
    expect(document.body.textContent).toBe('Updated by GitHub');
  });

  it('translates inserted UI while leaving inserted content intact', async () => {
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    dialog.innerHTML =
      '<button>Merge pull request</button><div class="comment-body">Fork</div>';
    document.body.append(dialog);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(dialog.querySelector('button')?.textContent).toBe(
      '提案された変更を統合',
    );
    expect(dialog.querySelector('.comment-body')?.textContent).toBe('Fork');
    observer.disconnect();
  });

  it('translates a menu when GitHub reveals it', async () => {
    document.body.innerHTML =
      '<nav><div hidden><a href="/example/project/issues">Issues</a></div></nav>';
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    expect(document.querySelector('a')?.textContent).toBe('Issues');
    document.querySelector('div')!.removeAttribute('hidden');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('a')?.textContent).toBe('課題と相談');
    observer.disconnect();
  });

  it('covers profile tabs and official search actions', () => {
    document.body.innerHTML = `
      <nav aria-label="User profile"><a href="/haruka-ds">Overview</a><a href="/haruka-ds?tab=repositories">Repositories</a></nav>
      <a data-component="Link" href="/search/advanced">Advanced search</a>
      <a data-component="Button" href="/login?return_to=search">Star</a>
      <div class="markdown-body"><a data-component="Button" href="/login">Star</a></div>`;
    const engine = new TranslationEngine();
    engine.scan(document.body);
    expect(document.querySelector('nav')?.textContent).toBe(
      '概要リポジトリ一覧',
    );
    expect(
      document.querySelector('a[href="/search/advanced"]')?.textContent,
    ).toBe('詳細検索');
    expect(
      document.querySelector('a[data-component="Button"]')?.textContent,
    ).toBe('お気に入りに保存');
    expect(document.querySelector('.markdown-body')?.textContent).toBe('Star');
  });
});
