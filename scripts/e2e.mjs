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
  assert.equal(
    await page.locator('#greeting').textContent(),
    'こんばんは、haruka-ds さん！',
  );
  assert.equal(
    await page.locator('aside h2').textContent(),
    'よく使うリポジトリ',
  );
  assert.equal(
    await page.locator('a[href="/pulls"]').first().textContent(),
    '変更の提案',
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
    menu.innerHTML = '<button id="dynamic-dismiss">Dismiss</button>';
    document.body.append(menu);
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML =
      '<main><h2>All caught up!</h2></main>';
    document.body.append(host);
  });
  await waitText(page, '#dynamic-dismiss', '閉じる');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('body > div')].some(
      (host) =>
        host.shadowRoot?.querySelector('h2')?.textContent ===
        '新しい通知はありません',
    ),
  );
  console.log('SPA, dynamic DOM and open shadow root PASS');

  assert.deepEqual(errors, []);
  console.log('Page errors: none');
} finally {
  await context.close();
  await rm(profile, { recursive: true, force: true });
}
