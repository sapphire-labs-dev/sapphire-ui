import { describe, expect, it } from 'vitest';
import { clampNumber, cleanString, isNonEmptyString, isObject, isTime, isTimeOrNull, oneOf } from './check';

describe('storage validation helpers', () => {
  it('recognises plain objects only', () => {
    expect(isObject({})).toBe(true);
    expect([null, [], 'x', 1, undefined].map(isObject)).toEqual([false, false, false, false, false]);
  });

  it('accepts only finite, non-negative times', () => {
    expect([0, 5, 1e12].every(isTime)).toBe(true);
    expect([-1, NaN, Infinity, '5', null].some(isTime)).toBe(false);
    expect(isTimeOrNull(null)).toBe(true);
  });

  it('clamps numbers and falls back for anything else', () => {
    expect(clampNumber(500, 0, 100, 7)).toBe(100);
    expect(clampNumber(-5, 0, 100, 7)).toBe(0);
    expect(clampNumber('50', 0, 100, 7)).toBe(7);
    expect(clampNumber(NaN, 0, 100, 7)).toBe(7);
  });

  it('trims and cuts strings', () => {
    expect(cleanString('  hello  ', 3)).toBe('hel');
    expect(cleanString(42, 3, 'x')).toBe('x');
    expect(isNonEmptyString('  ')).toBe(false);
  });

  it('keeps only allowed values', () => {
    expect(oneOf('b', ['a', 'b'] as const, 'a')).toBe('b');
    expect(oneOf('z', ['a', 'b'] as const, 'a')).toBe('a');
  });
});
