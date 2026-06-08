/* On Paper — reveal on scroll/load. Elementos con [data-reveal]; [data-reveal-load] disparan al cargar
   (above-the-fold: navbar/hero), el resto al entrar al viewport. Respeta prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(el) { el.classList.add('is-in'); }

  function init(root) {
    root = root || document;
    var els = root.querySelectorAll('[data-reveal]:not(.is-in)');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(show);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    els.forEach(function (el) {
      if (el.hasAttribute('data-reveal-load')) {
        requestAnimationFrame(function () { requestAnimationFrame(function () { show(el); }); });
      } else {
        io.observe(el);
      }
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', function () { init(); });
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
