import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { TranslationEngine } from '../src/engine';
import { observeUi } from '../src/observer';

const html = readFileSync(resolve('tests/fixtures/repository.html'), 'utf8');
const japanese =
  '「日本語で読める」「操作の意味がわかる」「次に何をすればよいか推測できる」の三つを設計の目安にします。';
const identifiers = [
  '.github/workflows',
  'scripts',
  'src',
  'tests',
  'README.md',
  'LICENSE',
  'PRIVACY.md',
  'PRODUCT_CONCEPT.md',
  'Settings',
  'Actions',
  'Projects',
  'Issues',
  'Home',
  'Feed',
];

function show(path = '/haruka-ds/github-ja-ui'): void {
  history.replaceState(null, '', path);
  document.body.innerHTML = new DOMParser().parseFromString(
    html,
    'text/html',
  ).body.innerHTML;
}

function structure(element: Element): {
  nodes: Node[];
  parents: (Node | null)[];
  links: { node: Element; href: string | null; parent: Node | null }[];
} {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
  const nodes: Node[] = [element];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return {
    nodes,
    parents: nodes.map((node) => node.parentNode),
    links: [...element.querySelectorAll('a')].map((node) => ({
      node,
      href: node.getAttribute('href'),
      parent: node.parentNode,
    })),
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('repository, prose and DOM invariants', () => {
  it('translates only the observed directory table headers', () => {
    show();
    const fixture = document.createElement('section');
    fixture.innerHTML = `
      <div data-testid="directory-content">
        <table aria-labelledby="folders-and-files"><thead><tr>
          <th><span>Name</span></th><th>Last commit message</th><th>Last commit date</th>
        </tr></thead><tbody><tr><td><a href="/haruka-ds/github-ja-ui/blob/main/Name">Name</a></td>
          <td>Last commit message</td><td>Last commit date</td></tr></tbody></table>
      </div>
      <table><thead><tr><th>Name</th><th>Last commit message</th></tr></thead></table>
      <button>Name</button>
      <p lang="ja">名前と変更日は変更しません。</p>`;
    document.body.append(fixture);
    const table = fixture.querySelector('table')!;
    const before = structure(fixture);
    const engine = new TranslationEngine();
    engine.scan(fixture);
    expect(
      [...table.querySelectorAll('thead th')].map((el) => el.textContent),
    ).toEqual(['名前', '最終変更', '変更日']);
    expect(
      [...table.querySelectorAll('tbody td')].map((el) => el.textContent),
    ).toEqual(['Name', 'Last commit message', 'Last commit date']);
    expect(fixture.querySelector(':scope > table')?.textContent).toBe(
      'NameLast commit message',
    );
    expect(fixture.querySelector('button')?.textContent).toBe('Name');
    expect(fixture.querySelector('p')?.textContent).toBe('名前と変更日は変更しません。');
    expect(structure(fixture)).toEqual(before);
    engine.scan(fixture);
    expect(table.querySelector('th')?.textContent).toBe('名前');
    engine.setEnabled(false);
    expect(table.querySelector('th')?.textContent).toBe('Name');
    engine.setEnabled(true);
    engine.scan(fixture);
    expect(table.querySelector('th')?.textContent).toBe('名前');
  });

  it('translates UI and reviewed English prose without changing identifiers or Japanese', () => {
    show();
    const engine = new TranslationEngine();
    const before = structure(document.body);
    const input = document.querySelector('#user-input')!;
    const button = document.querySelector('#fork-split')!;
    const originalJapanese =
      document.querySelector('#japanese-one')!.textContent;
    const originalJapaneseLink =
      document.querySelector('#japanese-link')!.textContent;
    expect(originalJapanese).toBe(
      'GitHub を使える人と使えない人の間にある、情報・機会の格差を縮めることを目指します。',
    );
    expect(originalJapaneseLink?.startsWith(japanese)).toBe(true);
    let clicks = 0;
    button.addEventListener('click', () => {
      clicks += 1;
    });
    engine.scan(document.body);
    expect(document.querySelector('#owner')?.textContent).toBe('haruka-ds');
    expect(document.querySelector('#repo')?.textContent).toBe('github-ja-ui');
    expect(
      document.querySelector('[data-testid="branch-name"]')?.textContent,
    ).toBe('main');
    expect(document.querySelector('#named-branch')?.textContent?.trim()).toBe(
      'Actions',
    );
    expect(
      [...document.querySelectorAll('[data-testid="file-tree"] a')].map(
        (a) => a.textContent,
      ),
    ).toEqual(identifiers);
    expect(
      document.querySelector('nav')?.textContent?.replace(/\s+/g, ' ').trim(),
    ).toBe('課題と相談 変更の提案 自動処理 作業計画');
    expect(document.querySelector('#english-heading')?.textContent).toBe(
      '使い始める',
    );
    expect(document.querySelector('#english-prose')?.textContent).toBe(
      'このプロジェクトの使い方を確認しましょう。',
    );
    expect(document.querySelector('#japanese-one')?.textContent).toBe(
      originalJapanese,
    );
    expect(document.querySelector('#japanese-link')?.textContent).toBe(
      originalJapaneseLink,
    );
    expect(document.querySelector('#japanese-link a')?.textContent).toBe(
      'PRODUCT_CONCEPT.md',
    );
    expect(document.querySelector('#fork-icon')?.textContent?.trim()).toBe(
      '自分用にコピー',
    );
    expect(button.textContent).toBe('自分用にコピー');
    (button as HTMLButtonElement).click();
    expect(clicks).toBe(1);
    expect(document.querySelector('#user-input')).toBe(input);
    expect((input as HTMLInputElement).value).toBe('Settings');
    expect(structure(document.body)).toEqual(before);
    const once = document.body.innerHTML;
    engine.scan(document.body);
    engine.scan(document.body);
    expect(document.body.innerHTML).toBe(once);
    engine.setEnabled(false);
    expect(button.textContent).toBe('Fork');
    engine.setEnabled(true);
    engine.scan(document.body);
    expect(button.textContent).toBe('自分用にコピー');
  });

  it('preserves link boundaries across all mixed-text shapes', () => {
    show();
    const ids = [
      'normal-only',
      'normal-then-link',
      'link-then-normal',
      'normal-link-normal',
      'multiple-links',
      'japanese-link',
      'english-link',
    ];
    const before = ids.map((id) => structure(document.getElementById(id)!));
    const raw = document.querySelector('#japanese-link')!.childNodes[0];
    new TranslationEngine().scan(document.body);
    ids.forEach((id, index) => {
      const after = structure(document.getElementById(id)!);
      expect(after).toEqual(before[index]);
      after.nodes.forEach((node, nodeIndex) => {
        expect(node).toBe(before[index].nodes[nodeIndex]);
        expect(node.parentNode).toBe(before[index].parents[nodeIndex]);
      });
      after.links.forEach((link, linkIndex) => {
        expect(link.node).toBe(before[index].links[linkIndex].node);
        expect(link.href).toBe(before[index].links[linkIndex].href);
      });
    });
    expect(raw.nodeValue).toContain('設計の目安にします。');
    expect(document.querySelector('#japanese-link a')?.textContent).toBe(
      'PRODUCT_CONCEPT.md',
    );
    expect([...document.querySelectorAll('#japanese-link a')]).toHaveLength(1);
    expect(
      document
        .querySelector('#english-link')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim(),
    ).toBe(
      'このプロジェクトの使い方を確認しましょう。 Guide このプロジェクトの使い方を確認しましょう。',
    );
  });

  it('keeps invariants on ten routes, SPA replacement and observed updates', async () => {
    const routes = [
      '/',
      '/haruka-ds/github-ja-ui',
      '/haruka-ds/github-ja-ui/issues',
      '/haruka-ds/github-ja-ui/pulls',
      '/haruka-ds/github-ja-ui/actions',
      '/haruka-ds/github-ja-ui/projects',
      '/settings/profile',
      '/search',
      '/haruka-ds',
      '/notifications',
    ];
    const engine = new TranslationEngine();
    const observer = observeUi(engine, document.body);
    for (const path of routes) {
      show(path);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.querySelector('#owner')?.textContent, path).toBe(
        'haruka-ds',
      );
      expect(
        document.querySelector('[data-testid="branch-name"]')?.textContent,
        path,
      ).toBe('main');
      expect(document.querySelector('#named-branch')?.textContent?.trim(), path).toBe(
        'Actions',
      );
      expect(
        document.querySelector('nav a[href$="/actions"]')?.textContent,
        path,
      ).toBe('自動処理');
      expect(
        document.querySelector('#japanese-link')?.firstChild?.nodeValue,
        path,
      ).toContain(japanese);
      expect(
        document.querySelector('#japanese-link a')?.textContent,
        path,
      ).toBe('PRODUCT_CONCEPT.md');
      expect(document.querySelector('#fork-split')?.textContent, path).toBe(
        '自分用にコピー',
      );
      expect(
        [...document.querySelectorAll('[data-testid="file-tree"] a')].map(
          (a) => a.textContent,
        ),
        path,
      ).toEqual(identifiers);
    }
    const dynamic = document.createElement('button');
    dynamic.innerHTML = '<span>F</span><span>ork</span>';
    document.body.append(dynamic);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(dynamic.textContent).toBe('自分用にコピー');
    observer.disconnect();
  });
});
