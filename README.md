# @sapphirelabs/ui

[![CI](https://github.com/sapphire-labs-dev/sapphire-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/sapphire-labs-dev/sapphire-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The shared look and plumbing of the Sapphire Labs tool sites ([Meeting Helpers](https://github.com/sapphire-labs-dev/meeting-helpers), [Coding Helpers](https://github.com/sapphire-labs-dev/coding-helpers)): one layout, three themes, English/Portuguese switching and a strict Content-Security-Policy, so each site only contains its own tools.

**Status: beta.** While the version is 0.x, class names, exports and props may still change in minor releases.

It is made for [Astro](https://astro.build) sites and ships TypeScript and `.astro` sources (no build step); the site's bundler compiles them.

## What is inside

| Import | What it gives you |
|---|---|
| `@sapphirelabs/ui/SiteLayout.astro` | Page shell: `<head>` (SEO, icons), header with your menu, language and theme switches, footer. Loads the fonts and the shared styles. |
| `@sapphirelabs/ui/components/Hero.astro`, `ToolCard.astro` | Home page pieces: big title and one card per tool (wrap cards in `<div class="tool-grid">`). The card's icon is optional (default slot) and `arrow={false}` drops the "→". |
| `@sapphirelabs/ui/components/Icon.astro` | Line icons for buttons: `copy`, `download`, `refresh`, `check`, `trash`, `external`. |
| `@sapphirelabs/ui/styles/*.css` | The theme tokens (`tokens.css`) and shared styles, for projects that are not Astro sites (see *Themes outside Astro*). |
| `@sapphirelabs/ui/config` | `siteConfig({ site })` for `astro.config.mjs`: CSP, no Markdown highlighting, scripts never inlined as `data:` URLs. |
| `@sapphirelabs/ui/i18n` | `strings()`, `mergeStrings()`, `uiStrings`, `createTranslator()`, `initI18n()`, `getLang()`, `setLang()`, `locale()`, `applyTitle()`. |
| `@sapphirelabs/ui/dom` | `$`, `h()` (text only, never `innerHTML`), copy and download helpers, full screen, wake lock, `formatBytes`. |
| `@sapphirelabs/ui/storage` | `load` / `save` / `remove` on `localStorage`, never throwing (private windows, full storage). |
| `@sapphirelabs/ui/check` | Validation helpers for data read back from storage. |
| `@sapphirelabs/ui/time`, `id`, `sound`, `theme` | Duration formatting, short ids, beeps, theme menu. |
| `@sapphirelabs/ui/testing` | `usedI18nKeys()` and `translationProblems()` for a site's Vitest suite. |

Shared CSS classes (in `src/styles/components.css`): page head, buttons, `.card`, form fields, `.segmented`, `.chips`, option cards (`.opt-grid`), the compact editable list (`.row-list`, `.row-btn`, `.add-row`), big timers (`.timer[data-state]`, `.clock`, `.bar`), summaries (`.sum-stats`, `.sum-table`), tool panels (`.panels`, `textarea.code`, `.kv`, `.tag`). Colours come only from the theme tokens in `tokens.css` (`--bg`, `--surface`, `--text`, `--accent`, `--ok`, `--warn`, `--danger`…), so every component works in the dark, light and kawaii themes.

## Using it in a site

```bash
npm install @sapphirelabs/ui astro
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { siteConfig } from '@sapphirelabs/ui/config';
export default defineConfig(siteConfig({ site: 'https://example.com' }));
```

```ts
// src/i18n/index.ts
import { createTranslator, mergeStrings, strings, uiStrings } from '@sapphirelabs/ui/i18n';
const home = strings({ 'title.home': 'My tools', 'nav.a': 'Tool A' }, { 'title.home': 'Minhas ferramentas', 'nav.a': 'Ferramenta A' });
export const dict = mergeStrings(uiStrings, home);
export const t = createTranslator(dict);
export { initI18n, getLang } from '@sapphirelabs/ui/i18n';
```

```astro
---
// src/layouts/Layout.astro
import SiteLayout from '@sapphirelabs/ui/SiteLayout.astro';
import { dict } from '../i18n';
const nav = [{ href: '/a', key: 'nav.a', label: 'Tool A' }];
---
<SiteLayout siteName="My Tools" {dict} {nav} description="…" titleKey="title.home"><slot /></SiteLayout>
```

Vitest needs to compile the package's TypeScript: add `server: { deps: { inline: ['@sapphirelabs/ui'] } }` to the `test` options.

`SiteLayout` options: without `dict` there is no language switch; `themes={false}` removes the theme menu (the site stays dark); a `footer` slot replaces the footer links; nav links can be external.

Browser storage keys use the prefix `sapphire:` (each site has its own origin, so sites never see each other's data).

## Themes outside Astro

`tokens.css` only applies inside an element with class `sapphire-theme`; `data-theme="light"` or `"kawaii"` on that element picks the theme (no attribute = dark). The sites put the class on `<html>`. An embedded app, like the Sapphire Blog CMS panel, puts it on its own root, so the theme never leaks into the page around it:

```ts
import tokens from '@sapphirelabs/ui/styles/tokens.css?inline';
import { THEMES } from '@sapphirelabs/ui/theme';
root.classList.add('sapphire-theme');
root.dataset.theme = 'kawaii';
```

Astro is an optional peer dependency: projects that only use the CSS and the TypeScript helpers do not need it.

## Development

Requires Node.js 22.23 or newer.

```bash
npm install
npm run check   # type-check, including the .astro components
npm test        # unit tests
```

To try a change in a site before publishing, install the package from the folder as a copy: put `install-links=true` in the site's `.npmrc` and run `npm install ../sapphire-ui` (after each change: delete `node_modules/@sapphirelabs/ui` and run `npm install` again).

## Releasing

1. Update `CHANGELOG.md` and bump `version` in `package.json` (semver: a breaking change to a class name, export or prop is a major version).
2. `npm publish --access public` (runs the checks first). Publishing needs a member of the `@sapphirelabs` npm organisation with two-factor authentication.
3. Update the version range in the sites.

## License and brand

The code is released under the [MIT License](LICENSE). The **Sapphire Labs** name and logo (`src/assets/`) are not covered by the license; if you reuse the package for your own sites, replace them.
