# Changelog

All notable changes to `@sapphirelabs/ui`. The format follows [Keep a Changelog](https://keepachangelog.com/) and the package uses [semantic versioning](https://semver.org/).

## 0.1.1

- Fix: links passed in `SiteLayout`'s `footer` slot now get the footer style (muted, no underline) instead of the default link style.

## 0.1.0

First version (beta), extracted from the Meeting Helpers site.

- Theme tokens apply inside `.sapphire-theme`, so embedded apps (the blog CMS panel) can use the themes without touching the host page.
- `Icon.astro`; `ToolCard` with optional icon and `arrow={false}`; `SiteLayout` with optional language switch and theme menu, a `footer` slot and external nav links.
- `./styles/*` export; Astro is an optional peer dependency.

- `SiteLayout.astro` with header menu, PT/EN switch, dark / light / kawaii themes and footer; self-hosted fonts.
- `Hero.astro` and `ToolCard.astro` for home pages.
- Shared component styles (lists, timers, summaries, tool panels).
- `siteConfig()` with a strict Content-Security-Policy.
- i18n helpers with type-checked Portuguese strings; storage, DOM, validation, time and sound helpers.
