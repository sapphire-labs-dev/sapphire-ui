// English / Portuguese strings for the tool sites.
//
// Each site declares its strings with `strings()` (Portuguese must have every
// English key, checked by TypeScript), merges them with `uiStrings` (words the
// shared layout and most tools use) and creates a typed `t()` with
// `createTranslator()`. The current language is shared by the whole page: the
// layout renders the merged dictionary as JSON (see I18nBoot.astro), which is
// what elements with data-i18n* attributes are translated from.

import { load, save } from '../client/storage';

export type Lang = 'en' | 'pt';
export const LANGS: readonly Lang[] = ['en', 'pt'];

export type Strings = Record<string, string>;
export interface Dict<T extends Strings = Strings> { en: T; pt: { [K in keyof T]: string } }

/**
 * Declare a group of strings: English first, then Portuguese. The Portuguese
 * object must have exactly the same keys, so a missing translation is a type
 * error instead of a bug found on screen.
 */
export function strings<const T extends Strings>(en: T, pt: { [K in keyof T]: string }): Dict<T> {
  return { en, pt };
}

type Merged<G extends readonly Dict[]> = G extends readonly [Dict<infer A>, ...infer Rest extends readonly Dict[]]
  ? A & Merged<Rest>
  : unknown;

/** Combine groups of strings into one dictionary. */
export function mergeStrings<const G extends readonly Dict[]>(...groups: G): Dict<Merged<G> & Strings> {
  const en: Strings = {};
  const pt: Strings = {};
  for (const g of groups) { Object.assign(en, g.en); Object.assign(pt, g.pt); }
  return { en, pt } as Dict<Merged<G> & Strings>;
}

/** Words used by the shared layout and by most tools. */
export const uiStrings = strings(
  {
    'theme.label': 'Theme',
    'theme.dark': 'Dark',
    'theme.light': 'Light',
    'theme.kawaii': 'Kawaii pink',
    'lang.label': 'Language',
    'footer.local': 'No login. Your data stays in this browser.',
    'common.add': 'Add',
    'common.moveUp': 'Move up',
    'common.moveDown': 'Move down',
    'common.remove': 'Remove',
    'common.resume': 'Resume',
    'common.discard': 'Discard',
    'common.paused': 'Paused',
    'common.pause': 'Pause',
    'common.start': 'Start',
    'common.reset': 'Reset',
    'common.fullscreen': 'Full screen',
    'common.copy': 'Copy',
    'common.copied': 'Copied',
    'common.download': 'Download',
    'common.clear': 'Clear',
    'common.soon': 'Coming soon',
  },
  {
    'theme.label': 'Tema',
    'theme.dark': 'Escuro',
    'theme.light': 'Claro',
    'theme.kawaii': 'Rosa kawaii',
    'lang.label': 'Idioma',
    'footer.local': 'Sem login. Seus dados ficam neste navegador.',
    'common.add': 'Adicionar',
    'common.moveUp': 'Subir',
    'common.moveDown': 'Descer',
    'common.remove': 'Remover',
    'common.resume': 'Continuar',
    'common.discard': 'Descartar',
    'common.paused': 'Pausado',
    'common.pause': 'Pausar',
    'common.start': 'Começar',
    'common.reset': 'Zerar',
    'common.fullscreen': 'Tela cheia',
    'common.copy': 'Copiar',
    'common.copied': 'Copiado',
    'common.download': 'Baixar',
    'common.clear': 'Limpar',
    'common.soon': 'Em breve',
  },
);

// ───────────── Current language (browser) ─────────────

const LANG_KEY = 'lang';
let lang: Lang = 'en';
let pageStrings: Dict | null = null;

export const getLang = (): Lang => lang;

/** BCP 47 tag for Intl formatting (dates, numbers). */
export const locale = (): string => (lang === 'pt' ? 'pt-BR' : 'en');

/** The dictionary the layout rendered into the page (empty outside a browser page). */
function pageDict(): Dict {
  if (!pageStrings) {
    try {
      pageStrings = JSON.parse(document.getElementById('i18n-dict')?.textContent ?? '') as Dict;
    } catch {
      pageStrings = { en: {}, pt: {} };
    }
  }
  return pageStrings;
}

function lookup(dict: Dict, key: string, vars: Record<string, string | number>): string {
  let s = dict[lang][key] ?? dict.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

/** A `t()` that only accepts keys of this dictionary. */
export function createTranslator<T extends Strings>(dict: Dict<T>) {
  return (key: keyof T & string, vars: Record<string, string | number> = {}): string => lookup(dict as Dict, key, vars);
}

/** Tab title from <body data-title-key>, e.g. "Daily timer · Sapphire Labs", or a live prefix such as a countdown. */
export function applyTitle(prefix?: string): void {
  if (prefix) { document.title = prefix; return; }
  const key = document.body.dataset.titleKey;
  if (key) document.title = `${lookup(pageDict(), key, {})} · Sapphire Labs`;
}

function applyStatic(): void {
  const dict = pageDict();
  document.documentElement.lang = locale();
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = lookup(dict, el.dataset.i18n!, {});
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = lookup(dict, el.dataset.i18nPlaceholder!, {});
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    el.title = lookup(dict, el.dataset.i18nTitle!, {});
    el.setAttribute('aria-label', el.title);
  });
  document.querySelectorAll<HTMLElement>('[data-set-lang]').forEach((el) => {
    el.setAttribute('aria-pressed', String(el.dataset.setLang === lang));
  });
  applyTitle();
}

export function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  save(LANG_KEY, lang);
  applyStatic();
  window.dispatchEvent(new CustomEvent('langchange'));
}

/** Language to use: the saved choice, else the browser language. */
export function detectLang(): Lang {
  const stored = load<unknown>(LANG_KEY, null);
  if (stored === 'pt' || stored === 'en') return stored;
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

let initialized = false;

/** Safe to call more than once: the layout and page scripts both call it. */
export function initI18n(): void {
  if (initialized) return;
  initialized = true;
  lang = detectLang();
  applyStatic();
  document.querySelectorAll<HTMLElement>('[data-set-lang]').forEach((el) => {
    el.addEventListener('click', () => setLang(el.dataset.setLang as Lang));
  });
}
