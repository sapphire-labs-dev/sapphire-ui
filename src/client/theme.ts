// Colour theme: dark (default), light or kawaii pink. The choice is stored in
// localStorage and applied as <html data-theme="…">; an inline script in the
// page <head> applies it before the first paint so the page never flashes.

import { load, save } from './storage';

export const THEMES = ['dark', 'light', 'kawaii'] as const;
export type Theme = (typeof THEMES)[number];

const KEY = 'theme';
/** Browser UI colour (mobile address bar) per theme, matching --bg. */
const META_COLOR: Record<Theme, string> = { dark: '#0b0d12', light: '#f6f7fb', kawaii: '#fff0f6' };

export function getTheme(): Theme {
  const t = load<string | null>(KEY, null);
  return (THEMES as readonly string[]).includes(t ?? '') ? (t as Theme) : 'dark';
}

function apply(theme: Theme): void {
  if (theme === 'dark') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  document.querySelectorAll<HTMLElement>('[data-set-theme]').forEach((el) => {
    el.setAttribute('aria-checked', String(el.dataset.setTheme === theme));
  });
}

export function setTheme(theme: Theme): void {
  save(KEY, theme);
  apply(theme);
}

/** Wire up the theme button and its small menu in the header. */
export function initThemeMenu(): void {
  // Pages without a theme menu (e.g. the main site) always stay dark.
  const root = document.querySelector<HTMLElement>('[data-theme-menu]');
  if (!root) return;
  apply(getTheme());
  const toggle = root.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
  const pop = root.querySelector<HTMLElement>('[role="menu"]')!;
  const items = [...pop.querySelectorAll<HTMLButtonElement>('[data-set-theme]')];

  const open = (focusCurrent: boolean) => {
    pop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (focusCurrent) (items.find((i) => i.getAttribute('aria-checked') === 'true') ?? items[0]).focus();
  };
  const close = (refocus: boolean) => {
    if (pop.hidden) return;
    pop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (refocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (pop.hidden ? open(false) : close(false)));
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(true); }
  });
  items.forEach((item) => item.addEventListener('click', () => {
    setTheme(item.dataset.setTheme as Theme);
    close(true);
  }));
  pop.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Tab') close(false);
  });
  // Escape closes the menu wherever focus is (it may still be on the toggle after a click).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pop.hidden) { e.preventDefault(); close(root.contains(document.activeElement)); }
  });
  document.addEventListener('click', (e) => { if (!root.contains(e.target as Node)) close(false); });
}
