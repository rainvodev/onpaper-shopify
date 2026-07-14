/* On Paper — GSAP: animación del sitio.
   · [data-reveal] / [data-split] → FADE IN simple y suave.
   · [data-mask] (+up|down|left|right) → reveal con máscara (clip-path). Solo superficies: menú, dropdowns, cart, imágenes.
   Blindado: nada queda oculto permanentemente. Respeta prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function forceShow(el) { el.classList.add('is-in'); if (window.gsap) { try { window.gsap.set(el, { clearProps: 'all' }); } catch (e) {} } }
  function forceAll(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-split]:not(.is-in), [data-mask]:not(.is-in)').forEach(forceShow);
  }
  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
  }

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap) {
      forceAll();
      document.addEventListener('shopify:section:load', function (e) { forceAll(e.target); });
      return;
    }
    try {
      if (ST) gsap.registerPlugin(ST);
      document.documentElement.classList.add('op-gsap');
      if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

      function trig(el, load) { return load ? {} : { scrollTrigger: { trigger: el, start: 'top 92%', once: true } }; }

      function reveal(root) {
        root = root || document;

        // Fade in — todos los elementos marcados
        root.querySelectorAll('[data-reveal]:not([data-op-rev]), [data-split]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var load = el.hasAttribute('data-reveal-load');
          gsap.fromTo(el, { opacity: 0 }, Object.assign({
            opacity: 1, duration: 0.9, ease: 'power2.out', delay: load ? delayOf(el) : 0,
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'opacity'
          }, trig(el, load)));
        });

        // Máscara — superficies (imágenes, etc.)
        root.querySelectorAll('[data-mask]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var dir = (el.getAttribute('data-mask') || 'up').trim();
          var fromClip = dir === 'right' ? 'inset(0 100% 0 0)' : dir === 'left' ? 'inset(0 0 0 100%)' : dir === 'down' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
          var load = el.hasAttribute('data-reveal-load');
          gsap.fromTo(el, { clipPath: fromClip }, Object.assign({
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power3.out', delay: load ? delayOf(el) : 0,
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath'
          }, trig(el, load)));
        });
      }

      reveal();
      document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });

      if (ST) {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); }).catch(function () {});
        window.addEventListener('load', function () { ST.refresh(); });
      }
      // Failsafe: nada visible en pantalla queda oculto
      window.addEventListener('load', function () {
        setTimeout(function () {
          document.querySelectorAll('[data-reveal]:not(.is-in), [data-split]:not(.is-in), [data-mask]:not(.is-in)').forEach(function (el) {
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
