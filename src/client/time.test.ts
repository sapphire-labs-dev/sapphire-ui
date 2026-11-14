import { describe, expect, it } from 'vitest';
import { formatClock, formatCountdown, formatShort } from './time';

describe('time formatting', () => {
  it('shows mm:ss, and h:mm:ss past an hour', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(61_000)).toBe('01:01');
    expect(formatClock(-61_000)).toBe('01:01');
    expect(formatClock(3_725_000)).toBe('1:02:05');
  });

  it('rounds a countdown up so 00:00 only shows when time is up', () => {
    expect(formatCountdown(4_500)).toBe('00:05');
    expect(formatCountdown(1)).toBe('00:01');
    expect(formatCountdown(0)).toBe('00:00');
  });

  it('writes short durations naturally in each language', () => {
    expect(formatShort(150_000, 'pt')).toBe('2 min 30 s');
    expect(formatShort(150_000, 'en')).toBe('2m 30s');
    expect(formatShort(120_000, 'pt')).toBe('2 min');
    expect(formatShort(45_000, 'pt')).toBe('45 s');
    expect(formatShort(45_000, 'en')).toBe('45s');
  });
});
