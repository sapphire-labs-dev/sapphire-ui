// Formatting of durations shared by the tools.

export function formatClock(ms: number): string {
  const total = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

/** Countdown display: rounds up while counting down so "00:00" means time is up. */
export function formatCountdown(remainingMs: number): string {
  if (remainingMs > 0) return formatClock(Math.ceil(remainingMs / 1000) * 1000);
  return formatClock(remainingMs);
}

export function formatShort(ms: number, lang: 'en' | 'pt'): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (lang === 'pt') {
    if (m === 0) return `${s} s`;
    return s === 0 ? `${m} min` : `${m} min ${s} s`;
  }
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m} min` : `${m}m ${s}s`;
}
