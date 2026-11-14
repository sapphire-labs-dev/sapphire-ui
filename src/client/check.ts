// Helpers to read data back from browser storage. Anything stored can be
// stale (an older version of the app), hand-edited or corrupted, so loaders
// treat it as `unknown` and rebuild a well-formed value from it.

export const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

export const isFiniteNumber = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** A timestamp or duration in ms: a finite number, never negative. */
export const isTime = (x: unknown): x is number => isFiniteNumber(x) && x >= 0;

export const isTimeOrNull = (x: unknown): x is number | null => x === null || isTime(x);

export const isNonEmptyString = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;

/** Number clamped to [min, max]; anything else becomes the fallback. */
export function clampNumber(x: unknown, min: number, max: number, fallback: number): number {
  return isFiniteNumber(x) ? Math.min(max, Math.max(min, x)) : fallback;
}

/** String trimmed and cut to `max` characters; anything else becomes the fallback. */
export function cleanString(x: unknown, max: number, fallback = ''): string {
  return typeof x === 'string' ? x.trim().slice(0, max) : fallback;
}

export function oneOf<T extends string>(x: unknown, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly unknown[]).includes(x) ? (x as T) : fallback;
}
