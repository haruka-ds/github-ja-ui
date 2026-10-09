const protectedSelector = [
  'input',
  'textarea',
  'select',
  'option',
  'pre',
  'code',
  'kbd',
  'samp',
  '[contenteditable]',
  '[role="textbox"]',
  '.blob-wrapper',
  '.blob-code',
  '.react-code-view',
  '.js-file-line-container',
  '.file-content',
  '.user-mention',
  '[data-github-ja-ui]',
].join(',');

// Rendered prose is eligible for the separate, conservative content dictionary.
// UI terms must never leak into an author's prose just because it contains a button.
const proseSelector = [
  '.markdown-body',
  '.markdown-preview',
  '.readme',
  '[data-testid="readme"]',
  '[data-testid="markdown-body"]',
  '.comment-body',
  '.js-comment-body',
  '.timeline-comment',
  '.js-issue-title',
  '.js-pull-request-title',
  '[data-testid="issue-title"]',
  '[data-testid="pull-request-title"]',
  '.commit-title',
  '.commit-message',
  '.release-body',
  '.discussion-comment',
  'article',
].join(',');

const identifierSelector = [
  '[data-testid="repository-name"]',
  '[data-testid="branch-name"]',
  '[data-testid="branch-selector"]',
  '[data-icv-name="Switch branches/tags"]',
  '.overview-ref-selector',
  '.ref-selector-button-text-container',
  '[aria-label$=" branch" i]',
  '[aria-label$=" tag" i]',
  '[data-testid="file-tree"]',
  '[data-testid="file-name"]',
  '[data-testid="path"]',
  '.react-directory-filename-column',
  '.react-directory-row-name-cell',
  '.js-navigation-open',
].join(',');

const uiContainerSelector = [
  'header',
  'nav',
  '[role="navigation"]',
  '[role="menu"]',
  '[role="dialog"]',
  '[role="tablist"]',
  '.flash',
  '.blankslate',
].join(',');

const uiControlSelector =
  'button, summary, [role="button"], [role="tab"], [role="menuitem"]';

type PageContext = NonNullable<Term['contexts']>[number];

function pageContext(): PageContext | undefined {
  const path = location.pathname;
  if (path === '/') return 'home';
  if (path.startsWith('/notifications')) return 'notifications';
  if (path.startsWith('/settings')) return 'settings';
  if (path === '/search') return 'search';
  if (/^\/[^/]+\/[^/]+\/issues\/?$/.test(path)) return 'issues';
  if (/^\/[^/]+\/[^/]+\/pulls\/?$/.test(path)) return 'pulls';
  if (/^\/[^/]+\/[^/]+\/actions\/?$/.test(path)) return 'actions';
  if (/^\/[^/]+\/[^/]+\/projects\/?$/.test(path)) return 'projects';
  if (/^\/[^/]+\/[^/]+\/?$/.test(path)) return 'repository';
  if (/^\/[^/]+\/?$/.test(path)) return 'profile';
  return undefined;
}

function closestAcrossRoots(
  element: Element,
  selector: string,
): Element | null {
  let current: Element | null = element;
  while (current) {
    const match: Element | null = current.closest(selector);
    if (match) return match;
    const root: Node = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }
  return null;
}

function isKnownUiLink(link: Element, term?: Term): boolean {
  const href = link.getAttribute('href');
  if (!href) return false;
  let path: string;
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return false;
    path = url.pathname;
  } catch {
    return false;
  }
  if (
    path === '/' ||
    /^\/(settings|notifications|issues|pulls|explore|dashboard|search|feed|repos|projects|discussions|codespaces|copilot|marketplace|mcp)(\/|$)/.test(
      path,
    )
  )
    return true;
  if (
    /^\/[^/]+\/[^/]+\/(issues|pulls|actions|projects|settings|wiki|security|pulse|discussions|branches|tags|releases|commits)\/?$/.test(
      path,
    )
  )
    return true;
  if (
    /^\/[^/]+\/?$/.test(path) &&
    (['Your profile', 'Overview'].includes(term?.original ?? '') ||
      (term?.original === 'Repositories' &&
        new URL(href, location.href).searchParams.get('tab') ===
          'repositories')) &&
    closestAcrossRoots(link, 'nav[aria-label="User profile"]')
  )
    return true;
  if (
    term?.original === 'Code' &&
    /^\/[^/]+\/[^/]+\/?$/.test(path) &&
    closestAcrossRoots(
      link,
      'nav[aria-label="Repository"], nav[aria-label="リポジトリ"]',
    )
  )
    return true;
  if (
    term?.original === 'New issue' &&
    /^\/[^/]+\/[^/]+\/issues\/new\/choose\/?$/.test(path) &&
    pageContext() === 'issues'
  )
    return true;
  if (
    term?.original === 'New pull request' &&
    /^\/[^/]+\/[^/]+\/compare\/?$/.test(path) &&
    pageContext() === 'pulls'
  )
    return true;
  if (
    ['Labels', 'Milestones'].includes(term?.original ?? '') &&
    /^\/[^/]+\/[^/]+\/(labels|milestones)\/?$/.test(path) &&
    ['issues', 'pulls'].includes(pageContext() ?? '')
  )
    return true;
  if (
    pageContext() === 'actions' &&
    ((term?.original === 'New workflow' &&
      /^\/[^/]+\/[^/]+\/actions\/new\/?$/.test(path)) ||
      (['Caches', 'Runners', 'Usage metrics', 'Performance metrics'].includes(
        term?.original ?? '',
      ) &&
        /^\/[^/]+\/[^/]+\/actions\/(caches|runners|metrics\/(usage|performance))\/?$/.test(
          path,
        )))
  )
    return true;
  if (
    ['Conversation', 'Commits', 'Checks', 'Files changed'].includes(
      term?.original ?? '',
    ) &&
    /^\/[^/]+\/[^/]+\/pull\/\d+(?:\/(commits|checks|changes))?\/?$/.test(
      location.pathname,
    ) &&
    /^\/[^/]+\/[^/]+\/pull\/\d+(?:\/(commits|checks|changes))?\/?$/.test(
      path,
    ) &&
    path.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/)?.[0] ===
      location.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/)?.[0]
  )
    return true;
  if (
    /^\/[^/]+\/?$/.test(path) &&
    closestAcrossRoots(link, 'nav[aria-label="User"]')
  ) {
    const tab = new URL(href, location.href).searchParams.get('tab');
    if (
      (tab === null && term?.original === 'Overview') ||
      (
        {
          repositories: 'Repositories',
          projects: 'Projects',
          packages: 'Packages',
          stars: 'Stars',
        } as Record<string, string>
      )[tab ?? ''] === term?.original
    )
      return true;
  }
  return (
    link.matches('a[data-component="Button"]') &&
    ['Star', 'Unstar', 'Fork', 'Watch', 'Unwatch'].includes(
      term?.original ?? '',
    ) &&
    path === '/login'
  );
}

export function isProtectedElement(element: Element): boolean {
  if (closestAcrossRoots(element, protectedSelector)) return true;
  if (closestAcrossRoots(element, identifierSelector)) return true;
  if (isProseElement(element) && closestAcrossRoots(element, 'a')) return true;
  const link = closestAcrossRoots(element, 'a[href]');
  if (link) {
    const href = link.getAttribute('href') ?? '';
    try {
      const url = new URL(href, location.href);
      if (
        url.origin === location.origin &&
        /^\/[^/]+\/[^/]+\/(?:blob|tree)\//.test(url.pathname)
      )
        return true;
    } catch {
      // An invalid URL cannot establish an identifier context.
    }
  }
  if (closestAcrossRoots(element, '[hidden], [aria-hidden="true"]'))
    return true;
  if (element instanceof HTMLElement && element.isContentEditable) return true;
  return false;
}

export function isProseElement(element: Element): boolean {
  return !!closestAcrossRoots(element, proseSelector);
}

function isPageScopedUi(element: Element, term?: Term): boolean {
  const context = pageContext();
  if (!context || !term?.contexts?.includes(context)) return false;
  if (term.surface === 'empty-state')
    return !!closestAcrossRoots(element, '[class*="Blankslate-"]');
  if (term.surface === 'form-label')
    return !!closestAcrossRoots(
      element,
      'label, [class*="FormControl-ControlVerticalLayout"]',
    );
  if (term.surface === 'page-copy' && closestAcrossRoots(element, 'main'))
    return true;
  if (closestAcrossRoots(element, 'h1, h2, h3, h4, [role="heading"]'))
    return true;
  if (context === 'settings' && closestAcrossRoots(element, 'label'))
    return true;
  if (
    context === 'home' &&
    closestAcrossRoots(element, 'aside, [role="complementary"]')
  )
    return true;
  if (
    context === 'notifications' &&
    closestAcrossRoots(element, '[role="toolbar"], [role="tablist"]')
  )
    return true;
  return (
    context === 'settings' &&
    !!closestAcrossRoots(element, 'aside, [role="complementary"]')
  );
}

function isKnownReferencedLabel(element: Element, term?: Term): boolean {
  if (
    !element.id ||
    !closestAcrossRoots(element, 'header') ||
    closestAcrossRoots(element, protectedSelector) ||
    closestAcrossRoots(element, identifierSelector) ||
    isProseElement(element) ||
    closestAcrossRoots(element, '[hidden]') ||
    ![
      'All repositories',
      'All issues',
      'All pull requests',
      'Open menu',
      'Open quick search dialog, type / to search ( forward slash )',
      'Create new...',
      'Open user navigation menu',
    ].includes(term?.original ?? '')
  )
    return false;
  const expectedPath = (
    {
      'All repositories': '/repos',
      'All issues': '/issues',
      'All pull requests': '/pulls',
    } as Record<string, string>
  )[term!.original];
  if (!expectedPath) {
    return [
      ...document.querySelectorAll('header button[aria-labelledby]'),
    ].some(
      (button) =>
        button.className.includes('IconButton') &&
        button
          .getAttribute('aria-labelledby')
          ?.split(/\s+/)
          .includes(element.id),
    );
  }
  for (const link of document.querySelectorAll(
    'header a[data-component="IconButton"][aria-labelledby][href]',
  )) {
    if (
      link.getAttribute('href') === expectedPath &&
      link.getAttribute('aria-labelledby')?.split(/\s+/).includes(element.id)
    )
      return true;
  }
  return false;
}

export function isTrustedUiElement(element: Element, term?: Term): boolean {
  // GitHub's icon-button tooltip is aria-hidden until shown, but the same
  // exact span supplies the button's accessible name via aria-labelledby.
  if (isKnownReferencedLabel(element, term)) return true;
  if (isProtectedElement(element)) return false;
  if (isProseElement(element)) return false;
  const link = closestAcrossRoots(element, 'a');
  if (link) return isKnownUiLink(link, term) && !isProtectedElement(link);
  if (term?.original === 'Code') return false;
  const control = element.closest(uiControlSelector);
  if (control) return !isProtectedElement(control);
  if (closestAcrossRoots(element, uiContainerSelector)) return true;
  return isPageScopedUi(element, term);
}

export function shouldTranslate(node: Text, term?: Term): boolean {
  const parent = node.parentElement;
  if (!parent || !node.nodeValue?.trim()) return false;
  if (parent.closest('script, style, noscript, svg, title')) return false;
  return isTrustedUiElement(parent, term);
}

export function shouldTranslateAttribute(
  element: Element,
  attribute: string,
  term?: Term,
): boolean {
  if (!['title', 'aria-label', 'placeholder'].includes(attribute)) return false;
  if (element.matches('input, textarea, [role="combobox"]')) {
    if (isProtectedElement(element.parentElement ?? element)) return false;
    const context = pageContext();
    if (
      context === 'home' &&
      attribute === 'placeholder' &&
      term?.original === 'Ask anything or type @ to add context' &&
      closestAcrossRoots(element, 'main')
    )
      return true;
    return (
      !!term &&
      (context === 'notifications' ||
        context === 'settings' ||
        (context === 'issues' && term.original === 'Search issues') ||
        (context === 'pulls' && term.original === 'Search pull requests') ||
        (context === 'actions' && term.original === 'Filter workflow runs') ||
        (context === 'projects' &&
          ['Search projects', 'Search by name…'].includes(term.original)) ||
        !!closestAcrossRoots(element, 'header, [role="search"]'))
    );
  }
  if (attribute === 'placeholder') return false;
  return isTrustedUiElement(element, term);
}
import type { Term } from './terminology';
