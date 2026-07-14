/* On Paper — transición entre páginas. Cortina suave al salir; el contenido entra con un fundido (CSS .op-main).
   Blindado: jamás atrapa al usuario. Omite enlaces externos, nueva pestaña, descargas, anclas, carrito y menú.
   No corre en el editor de Shopify ni con prefers-reduced-motion. */
(function () {
  'use strict';
  if (window.Shopify && window.Shopify.designMode) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var overlay = null;
  var navigating = false;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'op-transition';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    return overlay;
  }

  // Selectores que NO deben disparar transición (los maneja otro script).
  function isExcluded(a) {
    return a.hasAttribute('data-no-transition') ||
      a.hasAttribute('data-op-cart-open') ||
      a.hasAttribute('data-op-cart-close') ||
      a.hasAttribute('data-op-trigger') ||
      a.hasAttribute('data-op-burger') ||
      !!(a.closest && a.closest('[data-no-transition]'));
  }

  function shouldIntercept(a, e) {
    if (e.defaultPrevented) return false;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (!a || !a.getAttribute('href')) return false;
    if (a.hasAttribute('download')) return false;
    var target = a.getAttribute('target');
    if (target && target !== '_self') return false;
    if (a.getAttribute('rel') === 'external') return false;
    if (isExcluded(a)) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false; // mailto:, tel:, etc.
    // Navegación dentro de la misma página (anclas, mismo path) → la maneja el navegador.
    if (url.pathname === location.pathname && url.search === location.search) return false;
    return true;
  }

  function reset() {
    navigating = false;
    if (overlay) {
      if (window.gsap) window.gsap.set(overlay, { opacity: 0 });
      overlay.style.opacity = '';
      overlay.classList.remove('is-active');
    }
  }

  function go(href) {
    if (navigating) return;
    navigating = true;
    window.location.href = href;
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !shouldIntercept(a, e)) return;
    var href = a.href;
    if (!window.gsap) { return; } // sin GSAP, navegación normal del navegador
    e.preventDefault();
    var ov = ensureOverlay();
    ov.classList.add('is-active');
    window.gsap.killTweensOf(ov);
    window.gsap.fromTo(ov, { opacity: 0 }, {
      opacity: 1, duration: 0.42, ease: 'power2.inOut',
      onComplete: function () { go(href); }
    });
    // Salvavidas: si la animación se atasca, navega igual.
    setTimeout(function () { go(href); }, 700);
    // Recuperación: si la navegación se cancela (beforeunload "Quedarse", 204, descarga) la página
    // sigue viva; no dejes la cortina puesta. Si la navegación tuvo éxito, este timer muere con la página.
    setTimeout(function () { if (!document.hidden) reset(); }, 2000);
  });

  // Al volver con el botón atrás (bfcache) la página puede restaurarse con la cortina puesta: resetéala.
  window.addEventListener('pageshow', reset);
})();
