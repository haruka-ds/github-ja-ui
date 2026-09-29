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
  'button, summary, [role="button"], [role="tab"], [role="menuitem"], a[data-component="Button"]';

function isKnownUiLink(link: Element): boolean {
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
    /^\/(settings|notifications|issues|pulls|explore|dashboard|search)(\/|$)/.test(
      path,
    )
  )
    return true;
  if (
    /^\/[^/]+\/[^/]+\/(issues|pulls|actions|projects|settings|wiki|security|pulse|discussions|branches|tags|releases|commits)(\/|$)/.test(
      path,
    )
  )
    return true;
  if (
    /^\/[^/]+\/?$/.test(path) &&
    link.closest('nav[aria-label="User profile"]')
  )
    return true;
  return (
    /^\/[^/]+\/[^/]+\/?$/.test(path) &&
    !!link.closest(
      'nav[aria-label*="Repository"], [role="navigation"][aria-label*="Repository"]',
    )
  );
}

export function isProtectedElement(element: Element): boolean {
  if (element.closest(protectedSelector)) return true;
  if (element.closest('[hidden], [aria-hidden="true"]')) return true;
  if (element instanceof HTMLElement && element.isContentEditable) return true;
  return false;
}

export function isTrustedUiElement(element: Element): boolean {
  if (isProtectedElement(element)) return false;
  const control = element.closest(uiControlSelector);
  if (control) return !isProtectedElement(control);
  const link = element.closest('a');
  if (link)
    return (
      !isProtectedElement(link) &&
      (!!link.closest(uiContainerSelector) ||
        link.matches('a[data-component="Link"][href="/search/advanced"]')) &&
      isKnownUiLink(link)
    );
  return !!element.closest(uiContainerSelector);
}

export function shouldTranslate(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent || !node.nodeValue?.trim()) return false;
  if (parent.closest('script, style, noscript, svg, title')) return false;
  return isTrustedUiElement(parent);
}

export function shouldTranslateAttribute(
  element: Element,
  attribute: string,
): boolean {
  if (attribute !== 'title' && attribute !== 'aria-label') return false;
  return isTrustedUiElement(element);
}
