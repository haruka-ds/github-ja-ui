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
  '.markdown-body',
  '.markdown-preview',
  '.readme',
  '.blob-wrapper',
  '.blob-code',
  '.react-code-view',
  '.js-file-line-container',
  '.file-content',
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
  '.user-mention',
  '[data-github-ja-ui]',
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
  if (location.pathname === '/') return 'home';
  if (location.pathname.startsWith('/notifications')) return 'notifications';
  if (location.pathname.startsWith('/settings')) return 'settings';
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
    /^\/(settings|notifications|issues|pulls|explore|dashboard|search)(\/|$)/.test(
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
    closestAcrossRoots(link, 'nav[aria-label="User profile"]')
  )
    return true;
  if (
    term?.original === 'Code' &&
    /^\/[^/]+\/[^/]+\/?$/.test(path) &&
    closestAcrossRoots(
      link,
      'nav[aria-label*="Repository"], [role="navigation"][aria-label*="Repository"]',
    )
  )
    return true;
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
  if (closestAcrossRoots(element, '[hidden], [aria-hidden="true"]'))
    return true;
  if (element instanceof HTMLElement && element.isContentEditable) return true;
  return false;
}

function isPageScopedUi(element: Element, term?: Term): boolean {
  const context = pageContext();
  if (!context || !term?.contexts?.includes(context)) return false;
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

export function isTrustedUiElement(element: Element, term?: Term): boolean {
  if (isProtectedElement(element)) return false;
  const link = closestAcrossRoots(element, 'a');
  if (link) return isKnownUiLink(link, term) && !isProtectedElement(link);
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
  if (element.matches('input, textarea')) {
    if (isProtectedElement(element.parentElement ?? element)) return false;
    const context = pageContext();
    return (
      !!term &&
      (context === 'notifications' ||
        context === 'settings' ||
        !!closestAcrossRoots(element, 'header, [role="search"]'))
    );
  }
  if (attribute === 'placeholder') return false;
  return isTrustedUiElement(element, term);
}
import type { Term } from './terminology';
