import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { chromium } from 'playwright';

const fixture = async (name) =>
  readFile(resolve('tests', 'fixtures', `${name}.html`), 'utf8');
const profile = await mkdtemp(join(tmpdir(), 'github-ja-ui-e2e-'));
const dist = resolve('dist');
const pages = {
  '/': await fixture('home'),
  '/notifications': await fixture('notifications'),
  '/settings/profile': await fixture('settings'),
  '/haruka-ds/github-ja-ui': await fixture('repository'),
  '/haruka-ds/github-ja-ui/issues':
    '<main><a id="new-issue" href="/haruka-ds/github-ja-ui/issues/new/choose">New issue</a><label>Search issues</label><div class="prc-Blankslate-Blankslate"><h2 id="issue-empty">No results matched your search</h2></div><article id="issue-title">New issue</article><span data-testid="repository-name">Issues</span></main>',
  '/haruka-ds/github-ja-ui/pulls':
    '<main><a id="new-pull" href="/haruka-ds/github-ja-ui/compare">New pull request</a><label>Search pull requests</label><div class="prc-Blankslate-Blankslate"><h2 id="pull-empty">No pull requests matched your search</h2></div><article id="pull-title">New pull request</article></main>',
  '/haruka-ds/github-ja-ui/actions':
    '<main><h2 id="all-workflows">All workflows</h2><h3>Management</h3><a id="new-workflow" href="/haruka-ds/github-ja-ui/actions/new">New workflow</a><button id="run-filter">Filter workflow runs</button><article id="workflow-name">All workflows</article><span data-testid="branch-name">main</span></main>',
  '/haruka-ds/github-ja-ui/projects':
    '<main><h2 id="repo-projects">Repository projects</h2><button id="link-project">Link a project</button><div class="prc-Blankslate-Blankslate"><h2 id="project-empty">No projects found</h2><p>There are no projects linked to this repository yet.</p></div><article id="project-name">Repository projects</article></main>',
  '/search':
    '<main><h2 id="filter-by">Filter by</h2><h3 id="languages">Languages</h3><button id="sort-best">Sort by: Best match</button><article id="result-title">Filter by</article><input id="query" value="github-ja-ui"></main>',
  '/haruka-ds':
    '<nav aria-label="User"><a id="overview" href="/haruka-ds">Overview</a><a id="profile-projects" href="/haruka-ds?tab=projects">Projects</a></nav><main><button id="edit-profile">Edit profile</button><h2 id="popular">Popular repositories</h2><article id="repo-description">Popular repositories</article><span data-testid="repository-name">github-ja-ui</span></main>',
};
const errors = [];
const context = await chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  headless: true,
  args: [`--disable-extensions-except=${dist}`, `--load-extension=${dist}`],
});

const waitText = (page, selector, expected) =>
  page.waitForFunction(
    ({ selector, expected }) =>
      document.querySelector(selector)?.textContent?.trim() === expected,
    { selector, expected },
    { timeout: 10000 },
  );

try {
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://github.com/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: pages[path] ?? pages['/'],
    });
  });

  await page.goto('https://github.com/');
  await waitText(page, 'h1', 'ホーム');
  assert.equal(await page.locator('#all-repos-label').textContent(), 'すべてのリポジトリ');
  assert.equal(await page.locator('#open-menu-label').textContent(), 'メニューを開く');
  assert.equal(await page.locator('a[aria-labelledby="all-repos-label"]').getAttribute('href'), '/repos');
  assert.equal(
    await page.locator('#greeting').textContent(),
    'こんにちは、haruka-ds さん！',
  );
  assert.equal(
    await page.locator('aside h2').textContent(),
    'よく使うリポジトリ',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/pulls"]').textContent(),
    'すべての変更の提案',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/feed"]').textContent(),
    'フィード',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/issues"]').textContent(),
    'すべての課題と相談',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/repos"]').textContent(),
    'すべてのリポジトリ',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/projects"]').textContent(),
    '作業計画',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/discussions"]').textContent(),
    '話し合い',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/codespaces"]').textContent(),
    'Codespaces',
  );
  assert.match(
    await page
      .locator('#expanded-menu a[href="/codespaces"]')
      .getAttribute('title'),
    /開発環境/,
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/copilot"]').textContent(),
    'Copilot',
  );
  assert.equal(
    await page.locator('#expanded-menu a[href="/mcp"]').textContent(),
    'MCP registry',
  );
  assert.match(
    await page.locator('#expanded-menu a[href="/mcp"]').getAttribute('title'),
    /AI/,
  );
  assert.equal(
    await page.locator('#expanded-menu button').textContent(),
    'もっと見る',
  );
  assert.equal(await page.locator('#menu-repository').textContent(), 'Feed');
  assert.equal(
    await page.locator('#copilot-prompt').getAttribute('placeholder'),
    '質問を入力。@ で関連情報を追加できます',
  );
  assert.equal(await page.locator('#copilot-prompt').inputValue(), 'Issues');
  assert.equal(
    await page.locator('#no-pulls').textContent(),
    '変更の提案は見つかりませんでした。絞り込みを変えてみてください。',
  );
  assert.equal(
    await page.locator('#no-issues').textContent(),
    '課題と相談は見つかりませんでした。絞り込みを変えてみてください。',
  );
  assert.equal(await page.locator('#username').textContent(), 'haruka-ds');
  assert.equal(await page.locator('#repo-name').textContent(), 'Settings');
  assert.equal(
    (await page.locator('#user-markdown').textContent())?.trim(),
    'Settings Issues Pull requests',
  );
  assert.equal(
    (await page.locator('#source-code').textContent())?.trim(),
    'Dashboard',
  );
  console.log('Home: exact UI and protected content PASS');

  await page.goto('https://github.com/notifications');
  await waitText(page, 'h1', '通知');
  assert.equal(await page.locator('nav a').first().textContent(), '受信箱');
  assert.equal(await page.locator('#search-label').textContent(), '通知を検索');
  assert.equal(
    await page.locator('#notification-search').getAttribute('placeholder'),
    '通知を検索',
  );
  assert.equal(
    await page.locator('#notification-search').inputValue(),
    'Issues',
  );
  assert.equal(
    await page.locator('#notification-subject').textContent(),
    'Settings',
  );
  assert.equal(
    (await page.locator('#sort').textContent())?.trim(),
    '並べ替え: 新しい順',
  );
  assert.equal(
    (await page.locator('#group').textContent())?.trim(),
    'グループ分け: 日付',
  );
  assert.deepEqual(
    (await page.locator('#sort-options button').allTextContents()).map((text) =>
      text.trim(),
    ),
    ['新しい順', '古い順'],
  );
  assert.deepEqual(
    (await page.locator('#group-options button').allTextContents()).map(
      (text) => text.trim(),
    ),
    ['リポジトリ', '日付'],
  );
  assert.equal(
    (await page.locator('#clutter-copy').textContent())?.trim(),
    '既読の通知をまとめて完了にすると、受信箱を整理できます。',
  );
  assert.equal(
    await page.locator('#inbox-copy').textContent(),
    'ひと息ついて、自分の作業に集中しましょう。',
  );
  assert.equal(
    (await page.locator('#user-comment').textContent())?.trim(),
    'Notifications',
  );
  console.log('Notifications: exact UI and protected content PASS');

  await page.goto('https://github.com/settings/profile');
  await waitText(page, 'h1', '設定');
  assert.equal(
    await page.locator('aside a').first().textContent(),
    '公開プロフィール',
  );
  assert.equal(
    await page.locator('label[for="bio"]').textContent(),
    '自己紹介',
  );
  assert.equal(await page.locator('#name').getAttribute('placeholder'), '名前');
  assert.equal(await page.locator('#name').inputValue(), 'Issues');
  assert.equal(await page.locator('#bio').inputValue(), 'Pull requests');
  assert.equal(await page.locator('#repo-name').textContent(), 'Settings');
  assert.equal(
    (await page.locator('#user-markdown').textContent())?.trim(),
    'Settings',
  );
  console.log('Settings: exact UI and protected content PASS');

  await page.goto('https://github.com/haruka-ds/github-ja-ui');
  await waitText(page, '#fork-split', '自分用にコピー');
  assert.equal(await page.locator('#owner').textContent(), 'haruka-ds');
  assert.equal(await page.locator('#repo').textContent(), 'github-ja-ui');
  assert.equal(
    await page.locator('[data-testid="branch-name"]').textContent(),
    'main',
  );
  assert.equal(
    (await page.locator('#named-branch').textContent())?.trim(),
    'Actions',
  );
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
  assert.deepEqual(
    await page.locator('[data-testid="file-tree"] a').allTextContents(),
    identifiers,
  );
  assert.equal(
    await page.locator('nav a[href$="/issues"]').textContent(),
    '課題と相談',
  );
  assert.equal(
    await page.locator('nav a[href$="/actions"]').textContent(),
    '自動処理',
  );
  assert.equal(
    await page.locator('#english-heading').textContent(),
    '使い始める',
  );
  assert.equal(
    await page.locator('#english-prose').textContent(),
    'このプロジェクトの使い方を確認しましょう。',
  );
  assert.equal(
    (await page.locator('#fork-icon').textContent())?.trim(),
    '自分用にコピー',
  );
  assert.equal(await page.locator('#japanese-link a').count(), 1);
  assert.equal(
    await page.locator('#japanese-link a').textContent(),
    'PRODUCT_CONCEPT.md',
  );
  assert.equal(
    await page.locator('#japanese-link a').getAttribute('href'),
    '/haruka-ds/github-ja-ui/blob/main/PRODUCT_CONCEPT.md',
  );
  assert.match(
    await page
      .locator('#japanese-link')
      .evaluate((el) => el.firstChild?.nodeValue ?? ''),
    /設計の目安にします。/,
  );
  assert.equal(await page.locator('#user-input').inputValue(), 'Settings');
  const snapshot = await page.locator('body').evaluate((body) => {
    const walk = document.createTreeWalker(body, NodeFilter.SHOW_ALL);
    const nodes = [body];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    return {
      tags: nodes.map((node) =>
        node.nodeType === Node.ELEMENT_NODE ? node.nodeName : '#text',
      ),
      parents: nodes.map((node) =>
        node.parentNode ? nodes.indexOf(node.parentNode) : -1,
      ),
      links: [...body.querySelectorAll('a')].map((a) => [
        a.getAttribute('href'),
        a.parentElement?.tagName,
      ]),
    };
  });
  await page.locator('#fork-split').click();
  const afterClick = await page.locator('body').evaluate((body) => {
    const walk = document.createTreeWalker(body, NodeFilter.SHOW_ALL);
    const nodes = [body];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    return {
      tags: nodes.map((node) =>
        node.nodeType === Node.ELEMENT_NODE ? node.nodeName : '#text',
      ),
      parents: nodes.map((node) =>
        node.parentNode ? nodes.indexOf(node.parentNode) : -1,
      ),
      links: [...body.querySelectorAll('a')].map((a) => [
        a.getAttribute('href'),
        a.parentElement?.tagName,
      ]),
    };
  });
  assert.deepEqual(afterClick, snapshot);
  console.log(
    'Repository: identifiers, prose, Japanese, Fork, links and DOM PASS',
  );

  for (const [path, checks, protectedChecks] of [
    [
      '/haruka-ds/github-ja-ui/issues',
      [
        ['#new-issue', '課題や相談を作成'],
        ['#issue-empty', '検索に一致する項目がありません'],
      ],
      [
        ['#issue-title', 'New issue'],
        ['[data-testid="repository-name"]', 'Issues'],
      ],
    ],
    [
      '/haruka-ds/github-ja-ui/pulls',
      [
        ['#new-pull', '変更を提案'],
        ['#pull-empty', '検索に一致する変更の提案はありません'],
      ],
      [['#pull-title', 'New pull request']],
    ],
    [
      '/haruka-ds/github-ja-ui/actions',
      [
        ['#all-workflows', 'すべての自動処理'],
        ['#new-workflow', '新しい自動処理'],
      ],
      [
        ['#workflow-name', 'All workflows'],
        ['[data-testid="branch-name"]', 'main'],
      ],
    ],
    [
      '/haruka-ds/github-ja-ui/projects',
      [
        ['#repo-projects', 'このリポジトリの作業計画'],
        ['#project-empty', '作業計画が見つかりません'],
      ],
      [['#project-name', 'Repository projects']],
    ],
    [
      '/search',
      [
        ['#filter-by', '絞り込み条件'],
        ['#sort-best', '並べ替え: 関連度順'],
      ],
      [['#result-title', 'Filter by']],
    ],
    [
      '/haruka-ds',
      [
        ['#overview', '概要'],
        ['#profile-projects', '作業計画'],
        ['#popular', 'よく見られるリポジトリ'],
      ],
      [
        ['#repo-description', 'Popular repositories'],
        ['[data-testid="repository-name"]', 'github-ja-ui'],
      ],
    ],
  ]) {
    await page.goto(`https://github.com${path}`);
    for (const [selector, expected] of checks)
      await waitText(page, selector, expected);
    for (const [selector, expected] of protectedChecks)
      assert.equal(await page.locator(selector).textContent(), expected);
  }
  console.log(
    'Six route-specific official UI and protected-content fixtures PASS',
  );

  await page.goto('https://github.com/settings/profile');
  await waitText(page, 'h1', '設定');

  const extensionPage = await context.newPage();
  await extensionPage.goto('chrome://extensions/');
  const findExtensionId = () => {
    const visit = (root) => {
      for (const element of root.querySelectorAll('*')) {
        if (element.tagName === 'EXTENSIONS-ITEM') return element.id;
        if (element.shadowRoot) {
          const found = visit(element.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    return visit(document);
  };
  await extensionPage.waitForFunction(findExtensionId);
  const extensionId = await extensionPage.evaluate(findExtensionId);
  assert.ok(extensionId, 'extension must be loaded');
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.locator('#enabled').uncheck();
  await waitText(page, 'h1', 'Settings');
  await page.reload();
  assert.equal(await page.locator('h1').textContent(), 'Settings');
  await popup.locator('#enabled').check();
  await waitText(page, 'h1', '設定');
  console.log('Popup ON → OFF → reload → ON PASS');

  await page.evaluate((html) => {
    history.pushState(null, '', '/notifications');
    document.body.innerHTML = new DOMParser().parseFromString(
      html,
      'text/html',
    ).body.innerHTML;
    document.dispatchEvent(new Event('turbo:load'));
  }, pages['/notifications']);
  await waitText(page, 'h1', '通知');
  await page.evaluate(() => {
    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.innerHTML = '<button id="dynamic-dismiss">Dismiss</button><a id="dynamic-settings" role="menuitem" href="/settings/notifications">Notification settings</a>';
    document.body.append(menu);
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML =
      '<main><h2>All caught up!</h2></main>';
    document.body.append(host);
  });
  await waitText(page, '#dynamic-dismiss', '閉じる');
  await waitText(page, '#dynamic-settings', '通知の設定');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('body > div')].some(
      (host) =>
        host.shadowRoot?.querySelector('h2')?.textContent ===
        '新しい通知はありません',
    ),
  );
  console.log('SPA, dynamic DOM and open shadow root PASS');

  for (const path of [
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
  ]) {
    await page.evaluate(
      ({ path, html }) => {
        history.pushState(null, '', path);
        document.body.innerHTML = new DOMParser().parseFromString(
          html,
          'text/html',
        ).body.innerHTML;
        document.dispatchEvent(new Event('turbo:load'));
      },
      { path, html: pages['/haruka-ds/github-ja-ui'] },
    );
    await waitText(page, '#fork-split', '自分用にコピー');
    assert.equal(await page.locator('#owner').textContent(), 'haruka-ds');
    assert.equal(
      await page.locator('[data-testid="branch-name"]').textContent(),
      'main',
    );
    assert.equal(
      (await page.locator('#named-branch').textContent())?.trim(),
      'Actions',
    );
    assert.deepEqual(
      await page.locator('[data-testid="file-tree"] a').allTextContents(),
      identifiers,
    );
    assert.equal(
      await page.locator('nav a[href$="/actions"]').textContent(),
      '自動処理',
    );
    assert.match(
      await page
        .locator('#japanese-link')
        .evaluate((el) => el.firstChild?.nodeValue ?? ''),
      /設計の目安にします。/,
    );
    assert.equal(
      await page.locator('#japanese-link a').textContent(),
      'PRODUCT_CONCEPT.md',
    );
  }
  console.log('Ten routes: SPA, UI, identifiers and links PASS');

  assert.deepEqual(errors, []);
  console.log('Page errors: none');
} finally {
  await context.close();
  await rm(profile, { recursive: true, force: true });
}
