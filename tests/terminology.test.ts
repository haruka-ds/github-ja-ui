import { describe, expect, it } from 'vitest';
import { dictionary, terms, translate } from '../src/terminology';
import { explanation } from '../src/explanation';

describe('terminology', () => {
  it('translates known UI but leaves unknown strings alone', () => {
    expect(translate('Settings')?.label).toBe('設定');
    expect(translate('My unique project')).toBeUndefined();
  });

  it('explains GitHub concepts with the original term', () => {
    for (const original of [
      'Fork',
      'Pull requests',
      'Issues',
      'Clone',
      'Commit changes',
      'Branches',
      'Merge',
    ]) {
      const term = translate(original);
      expect(term?.description).toBeTruthy();
      expect(explanation(term!)).toContain(original);
    }
  });

  it('has unique, complete entries', () => {
    expect(dictionary.size).toBe(terms.length);
    for (const term of terms) {
      expect(term.original.trim()).toBe(term.original);
      expect(term.label.trim()).toBe(term.label);
      expect(term.original).not.toBe('');
      expect(term.label).not.toBe('');
    }
  });
});
