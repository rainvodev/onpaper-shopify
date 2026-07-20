/* On Paper — GSAP: motor de animación del sitio.
   · [data-reveal]            → fade + rise suave. Variante: data-reveal="fade|up|down|left|right|zoom".
   · [data-split]             → título revelado palabra por palabra (SplitText). Fallback: reveal normal.
   · [data-mask] (+up|down|left|right) → reveal con máscara (clip-path). Superficies: imágenes, menú, cart.
   · [data-reveal-group]      → sus hijos [data-reveal] sin delay explícito heredan un stagger automático.
   · [data-reveal-load]       → dispara al cargar (above-the-fold). El resto, al entrar al viewport.
   · --reveal-delay           → retraso individual (para stagger). Honrado en load Y en scroll.
   · [data-parallax]          → desplazamiento sutil ligado al scroll. --parallax controla la intensidad (px).
   Blindado: nada queda oculto de forma permanente. Respeta prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function forceShow(el) { el.classList.add('is-in'); if (window.gsap) { try { window.gsap.set(el, { clearProps: 'all' }); } catch (e) {} } }
  function forceAll(root) {
    (root || document).querySelectorAll('[data-reveal]:not(.is-in), [data-split]:not(.is-in), [data-mask]:not(.is-in)').forEach(forceShow);
  }
  function delayOf(el) {
    var d = getComputedStyle(el).getPropertyValue('--reveal-delay').trim();
    if (!d) return 0;
    var n = parseFloat(d) || 0;
    return d.indexOf('ms') > -1 ? n / 1000 : n;
  }
  function numVar(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  }

  // Estado inicial (from) según la variante de data-reveal.
  function fromVars(el) {
    var v = (el.getAttribute('data-reveal') || 'up').trim();
    var d = 24;
    if (v === 'fade') return { opacity: 0 };
    if (v === 'down') return { opacity: 0, y: -d };
    if (v === 'left') return { opacity: 0, x: d };
    if (v === 'right') return { opacity: 0, x: -d };
    if (v === 'zoom') return { opacity: 0, scale: 0.96 };
    return { opacity: 0, y: d }; // up / '' por defecto
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
      if (Split) { try { gsap.registerPlugin(Split); } catch (e) { Split = null; } }
      document.documentElement.classList.add('op-gsap');
      if (window.lenis && ST) { window.lenis.on('scroll', ST.update); }

      function trig(el, load) { return load ? {} : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }; }

      // Título con SplitText — palabra por palabra. Blindado: si algo falla, se muestra entero.
      function splitReveal(el, load, delay) {
        var split = null, safety = null, words = null;
        function clearSafety() { if (safety) { clearTimeout(safety); safety = null; } }
        // Restaura visibilidad pase lo que pase: revierte el split y, si algo falla y las
        // palabras siguen en el DOM con opacity:0, también les limpia los estilos inline.
        function restore() { try { if (split) split.revert(); } catch (e) {} try { if (words && words.length) gsap.set(words, { clearProps: 'all' }); } catch (e) {} forceShow(el); }
        function bail() { clearSafety(); restore(); }
        try {
          split = new Split(el, { type: 'words', wordsClass: 'op-splitword', reduceWhiteSpace: true });
          words = split.words || [];
          if (!words.length) { bail(); return; }
          el.classList.add('is-in');
          gsap.set(el, { opacity: 1 });
          gsap.fromTo(words, { yPercent: 24, opacity: 0 }, Object.assign({
            yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: delay,
            // El salvavidas se arma cuando la animación realmente arranca (no al crear el tween):
            // en scroll el arranque puede tardar hasta que el título entra al viewport.
            onStart: function () { clearSafety(); safety = setTimeout(restore, (delay + words.length * 0.05 + 1.4) * 1000); },
            onComplete: function () { clearSafety(); try { split.revert(); } catch (e) {} gsap.set(el, { clearProps: 'opacity' }); }
          }, trig(el, load)));
        } catch (e) { bail(); }
      }

      function reveal(root) {
        root = root || document;

        // Stagger automático dentro de [data-reveal-group] (solo hijos sin delay propio).
        root.querySelectorAll('[data-reveal-group]:not([data-op-grp])').forEach(function (grp) {
          grp.setAttribute('data-op-grp', '');
          var step = numVar(grp, '--reveal-step', 90); // ms
          var i = 0;
          grp.querySelectorAll('[data-reveal]').forEach(function (child) {
            var explicit = getComputedStyle(child).getPropertyValue('--reveal-delay').trim();
            if (!explicit) { child.style.setProperty('--reveal-delay', (i * step) + 'ms'); i++; }
          });
        });

        // Reveal: fade + rise (todos los [data-reveal] que no sean máscara).
        root.querySelectorAll('[data-reveal]:not([data-op-rev]):not([data-mask]), [data-split]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var load = el.hasAttribute('data-reveal-load');
          var delay = delayOf(el);

          if (el.hasAttribute('data-split') && Split) { splitReveal(el, load, delay); return; }

          gsap.fromTo(el, fromVars(el), Object.assign({
            opacity: 1, x: 0, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', delay: delay,
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'opacity,transform'
          }, trig(el, load)));
        });

        // Máscara — superficies (imágenes, etc.).
        root.querySelectorAll('[data-mask]:not([data-op-rev])').forEach(function (el) {
          el.setAttribute('data-op-rev', '');
          if (reduce) { forceShow(el); return; }
          var dir = (el.getAttribute('data-mask') || 'up').trim();
          var fromClip = dir === 'right' ? 'inset(0 100% 0 0)' : dir === 'left' ? 'inset(0 0 0 100%)' : dir === 'down' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
          var load = el.hasAttribute('data-reveal-load');
          gsap.fromTo(el, { clipPath: fromClip }, Object.assign({
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power4.out', delay: delayOf(el),
            onStart: function () { el.classList.add('is-in'); }, clearProps: 'clipPath'
          }, trig(el, load)));
        });

        // Parallax sutil ligado al scroll (opt-in). No aplica en reduce.
        if (ST && !reduce) {
          root.querySelectorAll('[data-parallax]:not([data-op-plx])').forEach(function (el) {
            el.setAttribute('data-op-plx', '');
            var amt = numVar(el, '--parallax', 40); // px de recorrido total
            gsap.fromTo(el, { y: -amt / 2 }, {
              y: amt / 2, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
            });
          });
        }
      }

      reveal();
      document.addEventListener('shopify:section:load', function (e) { reveal(e.target); if (ST) ST.refresh(); });

      if (ST) {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); }).catch(function () {});
        window.addEventListener('load', function () { ST.refresh(); });
      }
      // Failsafe: nada visible en pantalla queda oculto.
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
