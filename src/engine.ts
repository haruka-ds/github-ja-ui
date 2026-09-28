import { explanation } from './explanation';
import { shouldTranslate, shouldTranslateAttribute } from './protection';
import { translate } from './terminology';

type TextRecord = { original: string; applied: string };
type AttributeRecord = { original: string | null; applied: string };

export class TranslationEngine {
  private readonly texts = new Map<Text, TextRecord>();
  private readonly attributes = new Map<
    Element,
    Map<string, AttributeRecord>
  >();
  private enabled = true;

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) this.restore();
  }

  scan(root: Node): void {
    if (!this.enabled) return;
    if (root.nodeType === Node.TEXT_NODE) {
      this.processText(root as Text);
      return;
    }
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE
    )
      return;
    if (root instanceof Element) this.processElement(root);
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.TEXT_NODE) this.processText(node as Text);
      else this.processElement(node as Element);
    }
  }

  private processText(node: Text): void {
    if (!shouldTranslate(node)) return;
    const current = node.nodeValue ?? '';
    const existing = this.texts.get(node);
    if (existing && current === existing.applied) return;
    const term = translate(current);
    if (!term) return;
    const leading = current.match(/^\s*/)?.[0] ?? '';
    const trailing = current.match(/\s*$/)?.[0] ?? '';
    const applied = `${leading}${term.label}${trailing}`;
    if (current === applied) return;
    this.texts.set(node, { original: current, applied });
    node.nodeValue = applied;
    if (term.description) {
      const control = node.parentElement?.closest(
        'button, summary, a, [role="button"], [role="tab"], [role="menuitem"]',
      );
      if (
        control &&
        shouldTranslateAttribute(control, 'title') &&
        !control.hasAttribute('title')
      ) {
        this.applyAttribute(control, 'title', explanation(term)!);
      }
    }
  }

  private processElement(element: Element): void {
    for (const attribute of ['aria-label', 'title']) {
      if (!shouldTranslateAttribute(element, attribute)) continue;
      const current = element.getAttribute(attribute);
      if (!current) continue;
      const existing = this.attributes.get(element)?.get(attribute);
      if (existing && current === existing.applied) continue;
      const term = translate(current);
      if (term) {
        const applied = attribute === 'title'
          ? (explanation(term) ?? term.label)
          : (term.description ? `${term.label}（${term.original}）` : term.label);
        this.applyAttribute(element, attribute, applied);
      }
    }
  }

  private applyAttribute(
    element: Element,
    attribute: string,
    applied: string,
  ): void {
    const original = element.getAttribute(attribute);
    if (original === applied) return;
    let records = this.attributes.get(element);
    if (!records) {
      records = new Map();
      this.attributes.set(element, records);
    }
    records.set(attribute, { original, applied });
    element.setAttribute(attribute, applied);
  }

  restore(): void {
    for (const [node, record] of this.texts) {
      if (node.nodeValue === record.applied) node.nodeValue = record.original;
    }
    for (const [element, records] of this.attributes) {
      for (const [attribute, record] of records) {
        if (element.getAttribute(attribute) !== record.applied) continue;
        if (record.original === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, record.original);
      }
    }
    this.texts.clear();
    this.attributes.clear();
  }

  pruneDisconnected(): void {
    for (const node of this.texts.keys()) {
      if (!node.isConnected) this.texts.delete(node);
    }
    for (const element of this.attributes.keys()) {
      if (!element.isConnected) this.attributes.delete(element);
    }
  }
}
