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
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) queue(node);
        if (mutation.removedNodes.length) {
          hasRemovals = true;
          schedule();
        }
      } else if (mutation.type === 'characterData') queue(mutation.target);
      else queue(mutation.target);
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['title', 'aria-label', 'hidden', 'aria-hidden'],
  });
  engine.scan(root);
  return observer;
}
