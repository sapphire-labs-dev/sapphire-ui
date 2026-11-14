// Thin, failure-proof wrapper around localStorage. Private windows or blocked
// storage must never break the app; we just lose persistence.

/** One prefix for every Sapphire Labs site; each site has its own origin anyway. */
const PREFIX = 'sapphire:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
}
