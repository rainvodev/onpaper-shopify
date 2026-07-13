/* On Paper — GSAP: motor de animación del sitio. Reveal con MÁSCARA (clip-path) + Lenis/ScrollTrigger.
   [data-reveal] = mask reveal suave · [data-reveal="fade|down|zoom"] variantes · [data-reveal-lines] =
   texto elegante línea por línea (stagger). [data-reveal-load] dispara al cargar; el resto en scroll.
   Sin GSAP → fallback por clase .is-in. Respeta prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'expo.out';

  function fallback(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-reveal-lines]:not(.is-in)')
      .forEach(function (el) { el.classList.add('is-in'); });
  }
  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
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
    if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

    function fromVars(el) {
      var v = el.getAttribute('data-reveal') || '';
      if (v === 'fade') return { opacity: 0 };
      if (v === 'zoom') return { opacity: 0, scale: 1.04 };
      if (v === 'down') return { opacity: 0, y: -14 };
      return { clipPath: 'inset(0 0 100% 0)', y: 20 }; // default: mask-down + rise
    }

    function reveal(root) {
      root = root || document;

      root.querySelectorAll('[data-reveal]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        if (reduce) { gsap.set(el, { clearProps: 'all' }); el.classList.add('is-in'); return; }
        var load = el.hasAttribute('data-reveal-load');
        var to = {
          opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)',
          duration: 1.1, ease: EASE, delay: load ? delayOf(el) : 0,
          onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath,transform,opacity'
        };
        if (!load) to.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
        gsap.fromTo(el, fromVars(el), to);
      });

      // Texto elegante: máscara por línea con stagger
      root.querySelectorAll('[data-reveal-lines]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        var lines = el.children.length ? el.children : [el];
        if (reduce) { gsap.set(lines, { clearProps: 'all' }); el.classList.add('is-in'); return; }
        var load = el.hasAttribute('data-reveal-load');
        var to = {
          clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.05, ease: EASE, stagger: 0.12,
          delay: load ? delayOf(el) : 0,
          onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath,transform'
        };
        if (!load) to.scrollTrigger = { trigger: el, start: 'top 85%', once: true };
        gsap.fromTo(lines, { clipPath: 'inset(0 0 100% 0)', y: '0.5em' }, to);
      });
    }

    reveal();
    document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
