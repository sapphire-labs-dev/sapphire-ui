// Applies the saved (or browser) language synchronously, right after the
// markup is parsed and before the first paint, so Portuguese users never see
// a flash of the English HTML. The strings come from the JSON block that
// components/I18nBoot.astro writes just before this script.
// i18n/index.ts takes over later for dynamic text and language switching.
(function () {
  try {
    var dict = JSON.parse(document.getElementById('i18n-dict').textContent);
    var lang = null;
    try { lang = JSON.parse(localStorage.getItem('sapphire:lang')); } catch (e) {}
    if (lang !== 'pt' && lang !== 'en') lang = (navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
    var d = dict[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = d[el.dataset.i18n]; if (v) el.textContent = v; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { var v = d[el.dataset.i18nPlaceholder]; if (v) el.placeholder = v; });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) { var v = d[el.dataset.i18nTitle]; if (v) { el.title = v; el.setAttribute('aria-label', v); } });
    document.querySelectorAll('[data-set-lang]').forEach(function (el) { el.setAttribute('aria-pressed', String(el.dataset.setLang === lang)); });
    var key = document.body.dataset.titleKey;
    if (key && d[key]) document.title = d[key] + ' · Sapphire Labs';
  } catch (e) {}
})();
