/* On Paper — GSAP: motor de animación del sitio.
   · [data-reveal] (+fade|down|zoom) → movimiento suave y elegante (fade + slide), SIN máscara.
   · [data-mask] (+up|down|left|right) → reveal con MÁSCARA (clip-path). Solo superficies: imágenes, cards, etc.
   · [data-split] → texto con GSAP SplitText (líneas enmascaradas + stagger).
   [data-reveal-load] dispara al cargar; el resto en scroll. Sin GSAP → fallback .is-in. Respeta reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'expo.out';

  function fallback(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-mask]:not(.is-in), [data-split]:not(.is-in)')
      .forEach(function (el) { el.classList.add('is-in'); });
  }
  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
  }

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!gsap) {
      fallback();
      document.addEventListener('shopify:section:load', function (e) { fallback(e.target); });
      return;
    }
    if (ST) gsap.registerPlugin(ST);
    if (Split) gsap.registerPlugin(Split);
    document.documentElement.classList.add('op-gsap');
    if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

    function trig(el, load) { return load ? {} : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }; }

    function reveal(root) {
      root = root || document;

      // 1) Elementos genéricos — fade + slide suave (sin máscara)
      root.querySelectorAll('[data-reveal]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        if (reduce) { gsap.set(el, { clearProps: 'all' }); el.classList.add('is-in'); return; }
        var v = el.getAttribute('data-reveal') || '';
        var from = { opacity: 0, y: 22 };
        if (v === 'fade') from = { opacity: 0 };
        else if (v === 'down') from = { opacity: 0, y: -16 };
        else if (v === 'zoom') from = { opacity: 0, scale: 1.05 };
        var load = el.hasAttribute('data-reveal-load');
        gsap.fromTo(el, from, Object.assign({
          opacity: 1, y: 0, scale: 1, duration: 1.1, ease: EASE, delay: load ? delayOf(el) : 0,
          onStart: function () { el.classList.add('is-in'); }, clearProps: 'transform,opacity'
        }, trig(el, load)));
      });

      // 2) Superficies / imágenes — máscara (clip-path)
      root.querySelectorAll('[data-mask]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        if (reduce) { gsap.set(el, { clearProps: 'all' }); el.classList.add('is-in'); return; }
        var dir = (el.getAttribute('data-mask') || 'up').trim();
        var fromClip = dir === 'right' ? 'inset(0 100% 0 0)'
          : dir === 'left' ? 'inset(0 0 0 100%)'
          : dir === 'down' ? 'inset(0 0 100% 0)'
          : 'inset(100% 0 0 0)'; // up (revela de abajo hacia arriba)
        var load = el.hasAttribute('data-reveal-load');
        gsap.fromTo(el, { clipPath: fromClip }, Object.assign({
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: EASE, delay: load ? delayOf(el) : 0,
          onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath'
        }, trig(el, load)));
      });

      // 3) Texto — GSAP SplitText (líneas enmascaradas con stagger)
      root.querySelectorAll('[data-split]:not([data-op-rev])').forEach(function (el) {
        el.setAttribute('data-op-rev', '');
        if (reduce || !Split) { gsap.set(el, { clearProps: 'all' }); el.classList.add('is-in'); return; }
        var load = el.hasAttribute('data-reveal-load');
        var run = function () {
          var split = new Split(el, { type: 'lines', mask: 'lines', linesClass: 'op-line' });
          gsap.from(split.lines, Object.assign({
            yPercent: 115, duration: 1.0, ease: EASE, stagger: 0.12, delay: load ? delayOf(el) : 0,
            onStart: function () { el.classList.add('is-in'); },
            onComplete: function () { if (split.revert) split.revert(); }
          }, trig(el, load)));
        };
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
      });
    }

    reveal();
    document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });
    if (ST) window.addEventListener('load', function () { ST.refresh(); });
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
