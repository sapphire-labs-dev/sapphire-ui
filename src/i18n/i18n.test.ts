import { describe, expect, it } from 'vitest';
import { translationProblems } from '../testing';
import { createTranslator, mergeStrings, strings, uiStrings } from './index';

describe('shared strings', () => {
  it('are complete in both languages', () => {
    expect(translationProblems(uiStrings)).toEqual([]);
  });

  it('merge groups and translate with placeholders', () => {
    const extra = strings({ 'x.hi': 'Hi {name}' }, { 'x.hi': 'Oi {name}' });
    const dict = mergeStrings(uiStrings, extra);
    const t = createTranslator(dict);
    expect(t('x.hi', { name: 'Ana' })).toBe('Hi Ana');
    expect(t('common.add')).toBe('Add');
  });

  it('reports translation problems', () => {
    const bad = { en: { a: 'A {n}', b: 'B' }, pt: { a: 'A', b: ' ' } };
    expect(translationProblems(bad, new Map([['c', 'file.ts']]))).toEqual([
      'empty pt: b',
      'placeholders differ: a',
      'undefined key: c (file.ts)',
    ]);
  });
});
