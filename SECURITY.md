# Security policy

`@sapphirelabs/ui` runs in the browsers of everyone who visits a Sapphire Labs site, so a flaw here affects every site.

## Reporting a vulnerability

Please **do not open a public issue**. Use **Security → Report a vulnerability** in this repository to send a private report with the steps to reproduce and the impact you expect. This is a small project maintained in spare time: we will look at every report as soon as we can, and credit reporters in the release notes unless you prefer not to be named.

Only the latest published version receives fixes.

## Guarantees the package keeps

- Text is set with `textContent` (`h()`, i18n); nothing uses `innerHTML`, `eval` or inline event handlers.
- `siteConfig()` sets a Content-Security-Policy that allows scripts, styles, fonts, images and workers only from the site itself and blocks all network requests to other origins. Boot scripts are separate files, never inline code or `data:` URLs.
- No third-party requests: fonts are bundled, there are no analytics or CDNs.
- Data read from `localStorage` goes through `load()` (never throws) and should be validated with the `check` helpers before use.
