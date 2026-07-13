/* On Paper — GSAP: motor de animación del sitio. Reveal on load/scroll (reemplaza op-reveal.js) con
   ScrollTrigger + puente a Lenis (smooth scroll). Sin GSAP → fallback que revela por clase .is-in.
   Conserva el atributo [data-reveal] y respeta prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fallback(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) { el.classList.add('is-in'); });
  }

  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
  }
  function fromVars(el) {
    var v = el.getAttribute('data-reveal') || '';
    var o = { opacity: 0 };
    if (v === 'fade') { /* solo opacity */ }
    else if (v === 'down') { o.y = -12; }
    else if (v === 'zoom') { o.scale = 1.04; }
    else { o.y = 18; }
    return o;
  }

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap) {
      fallback();
      document.addEventListener('shopify:section:load', function (e) { fallback(e.target); });
      return;
    }
    if (ST) gsap.registerPlugin(ST);
    document.documentElement.classList.add('op-gsap');
    // Puente Lenis ↔ ScrollTrigger para que las animaciones sigan al smooth scroll
    if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

    function reveal(root) {
      root = root || document;
      root.querySelectorAll('[data-reveal]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        if (reduce) { gsap.set(el, { opacity: 1, y: 0, scale: 1 }); el.classList.add('is-in'); return; }
        var to = {
          opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
          onStart: function () { el.classList.add('is-in'); }, clearProps: 'transform'
        };
        if (el.hasAttribute('data-reveal-load')) {
          to.delay = delayOf(el);
          gsap.fromTo(el, fromVars(el), to);
        } else {
          to.scrollTrigger = { trigger: el, start: 'top 90%', once: true };
          gsap.fromTo(el, fromVars(el), to);
        }
      });
    }

    reveal();
    document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
