import { TranslationEngine } from './engine';

export function observeUi(
  engine: TranslationEngine,
  root: Element = document.documentElement,
): MutationObserver {
  const pending = new Set<Node>();
  let scheduled = false;
  let hasRemovals = false;
  const flush = () => {
    scheduled = false;
    for (const node of pending) engine.scan(node);
    pending.clear();
    if (hasRemovals) engine.pruneDisconnected();
    hasRemovals = false;
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      queueMicrotask(flush);
    }
  };
  const queue = (node: Node) => {
    pending.add(node);
    schedule();
  };
  const options: MutationObserverInit = {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [
      'title',
      'aria-label',
      'placeholder',
      'hidden',
      'aria-hidden',
      'role',
      'href',
    ],
  };
  const observed = new WeakSet<Node>();
  const registerShadows = (node: Node) => {
    if (!(node instanceof Element) && !(node instanceof DocumentFragment))
      return;
    const elements =
      node instanceof Element
        ? [node, ...node.querySelectorAll('*')]
        : [...node.querySelectorAll('*')];
    for (const element of elements) {
      if (!element.shadowRoot || observed.has(element.shadowRoot)) continue;
      observed.add(element.shadowRoot);
      observer.observe(element.shadowRoot, options);
      engine.scan(element.shadowRoot);
      registerShadows(element.shadowRoot);
    }
  };
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          registerShadows(node);
          queue(node);
        }
        if (mutation.removedNodes.length) {
          hasRemovals = true;
          schedule();
        }
      } else if (mutation.type === 'characterData') queue(mutation.target);
      else queue(mutation.target);
    }
  });
  observer.observe(root, options);
  registerShadows(root);
  engine.scan(root);
  return observer;
}
