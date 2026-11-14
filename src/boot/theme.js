// Applies the saved colour theme before the first paint. Loaded synchronously
// from <head> by SiteLayout; a file (not an inline script) so the page can run under a
// strict Content-Security-Policy. client/theme.ts takes over afterwards.
(function () {
  try {
    var t = JSON.parse(localStorage.getItem('sapphire:theme'));
    if (t === 'light' || t === 'kawaii') document.documentElement.dataset.theme = t;
  } catch (e) {}
})();
