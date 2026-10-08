import { describe, expect, it } from 'vitest';
import { dictionary, terms, translate } from '../src/terminology';
import { explanation } from '../src/explanation';

describe('terminology', () => {
  it('translates known UI but leaves unknown strings alone', () => {
    expect(translate('Settings')?.label).toBe('設定');
    expect(translate('My unique project')).toBeUndefined();
    expect(translate('Sort by: Newest to oldest')?.label).toBe(
      '並べ替え: 新しい順',
    );
    expect(translate('Group by: Date')?.label).toBe('グループ分け: 日付');
    expect(translate('Sort by: Someone wrote this')).toBeUndefined();
    expect(translate('Good afternoon, haruka-ds!')?.label).toContain(
      'haruka-ds',
    );
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
