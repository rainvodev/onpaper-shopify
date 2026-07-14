/* On Paper — GSAP: motor de animación del sitio.
   · [data-reveal] (+fade|down|zoom) → movimiento suave y elegante (fade + slide), SIN máscara.
   · [data-mask] (+up|down|left|right) → reveal con MÁSCARA (clip-path). Solo superficies: imágenes, cards…
   · [data-split] → texto con GSAP SplitText (líneas enmascaradas + stagger).
   Blindado: nada queda oculto de forma permanente (failsafe + try/catch + refresh de ScrollTrigger). */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'power3.out';

  function forceShow(el) {
    el.classList.add('is-in');
    if (window.gsap) { try { window.gsap.set(el, { clearProps: 'all' }); } catch (e) {} }
  }
  function forceAll(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-mask]:not(.is-in), [data-split]:not(.is-in)')
      .forEach(forceShow);
  }
  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
  }

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!gsap) {
      forceAll();
      document.addEventListener('shopify:section:load', function (e) { forceAll(e.target); });
      return;
    }
    try {
      if (ST) gsap.registerPlugin(ST);
      if (Split) gsap.registerPlugin(Split);
      document.documentElement.classList.add('op-gsap');
      if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

      function trig(el, load) { return load ? {} : { scrollTrigger: { trigger: el, start: 'top 90%', once: true } }; }

      function reveal(root) {
        root = root || document;

        // 1) Elementos genéricos — fade + slide suave (sin máscara)
        root.querySelectorAll('[data-reveal]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var v = el.getAttribute('data-reveal') || '';
          var from = v === 'fade' ? { opacity: 0 } : v === 'down' ? { opacity: 0, y: -16 } : v === 'zoom' ? { opacity: 0, scale: 1.04 } : { opacity: 0, y: 22 };
          var load = el.hasAttribute('data-reveal-load');
          gsap.fromTo(el, from, Object.assign({
            opacity: 1, y: 0, scale: 1, duration: 0.9, ease: EASE, delay: load ? delayOf(el) : 0,
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'transform,opacity'
          }, trig(el, load)));
        });

        // 2) Superficies / imágenes — máscara (clip-path)
        root.querySelectorAll('[data-mask]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var dir = (el.getAttribute('data-mask') || 'up').trim();
          var fromClip = dir === 'right' ? 'inset(0 100% 0 0)' : dir === 'left' ? 'inset(0 0 0 100%)' : dir === 'down' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
          var load = el.hasAttribute('data-reveal-load');
          gsap.fromTo(el, { clipPath: fromClip }, Object.assign({
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: EASE, delay: load ? delayOf(el) : 0,
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath'
          }, trig(el, load)));
        });

        // 3) Texto — GSAP SplitText (líneas enmascaradas con stagger)
        root.querySelectorAll('[data-split]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce || !Split) { forceShow(el); return; }
          var load = el.hasAttribute('data-reveal-load');
          var run = function () {
            try {
              var split = new Split(el, { type: 'lines', mask: 'lines', linesClass: 'op-line' });
              el.classList.add('is-in');
              gsap.from(split.lines, Object.assign({
                yPercent: 120, duration: 0.9, ease: EASE, stagger: 0.1, delay: load ? delayOf(el) : 0,
                onComplete: function () { try { if (split.revert) split.revert(); } catch (e) {} }
              }, trig(el, load)));
            } catch (e) { forceShow(el); }
          };
          // Espera a las fuentes para medir líneas, con tope de 1.2s para no quedar oculto
          var ran = false, go = function () { if (ran) return; ran = true; run(); };
          if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go).catch(go); setTimeout(go, 1200); }
          else go();
        });
      }

      reveal();
      document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });

      // Recalcula posiciones tras fuentes/imágenes (evita triggers mal calculados)
      if (ST) {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); }).catch(function () {});
        window.addEventListener('load', function () { ST.refresh(); });
      }

      // Failsafe: nada visible en pantalla debe quedar oculto (lo fuera-de-pantalla se anima al hacer scroll)
      window.addEventListener('load', function () {
        setTimeout(function () {
          document.querySelectorAll('[data-reveal]:not(.is-in), [data-mask]:not(.is-in), [data-split]:not(.is-in)').forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) forceShow(el);
          });
          if (ST) ST.refresh();
        }, 1800);
      });
    } catch (e) { forceAll(); }
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
