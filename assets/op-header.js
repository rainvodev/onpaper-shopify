/* On Paper — Header mega-menú. Hover/click abre paneles; hover en item izquierdo cambia los 3 productos;
   Esc / click afuera cierra; drawer en móvil. Re-attach en shopify:section:load. */
(function () {
  'use strict';

  // Debug: actívalo con ?opdebug=1 en la URL, localStorage.opDebug='1', o window.OP_DEBUG=true.
  // Loguea el ciclo de apertura/cierre del menú + drawer y marca visualmente los elementos animados.
  var DEBUG = (function () {
    try {
      return /(?:^|[?&])opdebug=1\b/.test(location.search) ||
        (window.localStorage && localStorage.getItem('opDebug') === '1') ||
        window.OP_DEBUG === true;
    } catch (e) { return false; }
  })();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  function now() { return Math.round(((window.performance && performance.now) ? performance.now() : Date.now()) - t0); }
  function dbg() {
    if (!DEBUG || !window.console) return;
    var a = ['%c[op-header +' + now() + 'ms]', 'color:#b0b094;font-weight:600'];
    console.log.apply(console, a.concat([].slice.call(arguments)));
  }
  function mark(items, color) {
    if (!DEBUG || !items) return;
    [].forEach.call(items, function (el) { el.style.outline = '1px dashed ' + (color || '#e26'); el.style.outlineOffset = '2px'; });
  }
  if (DEBUG && window.console) console.log('%c[op-header] DEBUG ON — reduce=' + reduce, 'color:#e26;font-weight:700');

  function closeRoot(root) {
    dbg('closeRoot', root.__opCurrent);
    root.querySelectorAll('[data-op-panel].is-open').forEach(function (p) { p.classList.remove('is-open'); });
    root.querySelectorAll('[data-op-trigger]').forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-expanded', 'false'); });
    root.classList.remove('is-menu-open');
    root.__opCurrent = null;
  }

  function initHeader(root) {
    if (!root || root.__opHeaderInit) return;
    root.__opHeaderInit = true;

    var triggers = root.querySelectorAll('[data-op-trigger]');
    var panels = {};
    root.querySelectorAll('[data-op-panel]').forEach(function (p) { panels[p.getAttribute('data-op-panel')] = p; });
    var closeTimer = null;

    function open(name) {
      var panel = panels[name];
      if (!panel) return;
      // ¿Ya estaba abierto ESTE panel? Entonces es un re-hover (mouse que vuelve al trigger):
      // NO relanzar el stagger o los elementos "brincan" a su posición inicial y re-animan.
      var alreadyOpen = root.classList.contains('is-menu-open') && root.__opCurrent === name;
      Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('is-open', k === name); });
      root.classList.add('is-menu-open');
      triggers.forEach(function (t) {
        var on = t.getAttribute('data-op-trigger') === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      root.__opCurrent = name;

      if (alreadyOpen) { dbg('open(' + name + ') re-hover → skip stagger'); return; }

      // Stagger elegante del contenido (rise), sin tocar opacidad para respetar estados hover.
      if (window.gsap && !reduce) {
        var items = panel.querySelectorAll('.op-header_eyebrow, .op-header_menulink, .op-header_pcard');
        window.gsap.killTweensOf(items); // evita solapar tweens al cambiar de panel
        dbg('open(' + name + ') stagger', items.length, 'items');
        mark(items, '#2a7');
        window.gsap.fromTo(items, { y: 12 }, {
          y: 0, duration: 0.6, stagger: 0.028, ease: 'power3.out', delay: 0.04,
          overwrite: 'auto', force3D: true, clearProps: 'transform',
          onComplete: function () { dbg('open(' + name + ') stagger done'); }
        });
      }
    }
    function scheduleClose() { clearTimeout(closeTimer); closeTimer = setTimeout(function () { closeRoot(root); }, 180); }
    function cancelClose() { clearTimeout(closeTimer); }

    triggers.forEach(function (t) {
      var name = t.getAttribute('data-op-trigger');
      t.addEventListener('mouseenter', function () { cancelClose(); open(name); });
      t.addEventListener('click', function (e) {
        e.preventDefault();
        if (root.__opCurrent === name) { closeRoot(root); } else { open(name); }
      });
    });

    root.addEventListener('mouseleave', scheduleClose);
    root.addEventListener('mouseenter', cancelClose);

    // Hover sobre zonas del bar que NO son trigger (Others, logo, acciones) cierra el panel
    root.querySelectorAll('.op-header_logo, .op-header_actions, .op-header_nav a').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cancelClose(); closeRoot(root); });
    });

    root.querySelectorAll('[data-op-item]').forEach(function (link) {
      var key = link.getAttribute('data-op-item');
      function activate() {
        var panel = link.closest('[data-op-panel]');
        if (!panel) return;
        panel.querySelectorAll('[data-op-item]').forEach(function (l) { l.classList.toggle('is-active', l === link); });
        panel.querySelectorAll('[data-op-feature]').forEach(function (f) { f.classList.toggle('is-active', f.getAttribute('data-op-feature') === key); });
      }
      link.addEventListener('mouseenter', activate);
      link.addEventListener('focus', activate);
    });

    // Drawer móvil
    var burger = root.querySelector('[data-op-burger]');
    var drawer = root.querySelector('[data-op-drawer]');
    if (burger && drawer) {
      var g = window.gsap;
      var items = drawer.querySelectorAll('.op-header_acc, .op-header_accroot, .op-header_drawerloc');

      function openDrawer() {
        drawer.classList.add('is-open');
        root.classList.add('is-drawer-open');
        root.classList.remove('is-hidden');
        burger.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('op-no-scroll');
        if (window.lenis) window.lenis.stop();
        if (g) {
          g.killTweensOf([drawer, items]);
          dbg('openDrawer', items.length, 'items');
          mark(items, '#27a');
          // mask-down: se revela de arriba hacia abajo
          g.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.inOut' });
          g.fromTo(items, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power2.out', delay: 0.1, force3D: true });
        }
      }
      function closeDrawer() {
        dbg('closeDrawer');
        burger.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('op-no-scroll');
        if (window.lenis) window.lenis.start();
        if (g) {
          g.killTweensOf([drawer, items]);
          g.to(drawer, {
            clipPath: 'inset(0 0 100% 0)', duration: 0.4, ease: 'power3.in',
            onComplete: function () {
              drawer.classList.remove('is-open');
              root.classList.remove('is-drawer-open');
              g.set(drawer, { clearProps: 'clipPath' });
            }
          });
        } else {
          drawer.classList.remove('is-open');
          root.classList.remove('is-drawer-open');
        }
      }

      burger.addEventListener('click', function () {
        if (drawer.classList.contains('is-open')) closeDrawer(); else openDrawer();
      });
    }
  }

  function initAll() { document.querySelectorAll('[data-op-header]').forEach(initHeader); }

  // Listeners globales (una sola vez)
  if (!window.__opHeaderDocBound) {
    window.__opHeaderDocBound = true;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.querySelectorAll('[data-op-header].is-menu-open').forEach(closeRoot);
    });
    document.addEventListener('click', function (e) {
      document.querySelectorAll('[data-op-header].is-menu-open').forEach(function (root) {
        if (!root.contains(e.target)) closeRoot(root);
      });
    });
  }

  // Sticky con hide-on-scroll-down / show-on-scroll-up + offset del contenido (una sola vez)
  if (!window.__opHeaderScroll) {
    window.__opHeaderScroll = true;
    var lastY = window.scrollY || 0, ticking = false, HIDE_AFTER = 90;

    function apply() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      document.querySelectorAll('[data-op-header]').forEach(function (h) {
        // Histéresis para el fondo (evita flicker cerca del umbral)
        if (y > 48) h.classList.add('is-scrolled');
        else if (y < 8) h.classList.remove('is-scrolled');
        if (h.classList.contains('is-drawer-open')) { h.classList.remove('is-hidden'); }
        else if (y > HIDE_AFTER && y > lastY + 6) { h.classList.add('is-hidden'); }
        else if (y < lastY - 6 || y <= HIDE_AFTER) { h.classList.remove('is-hidden'); }
      });
      lastY = y;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });

    function offset() {
      document.querySelectorAll('[data-op-header]').forEach(function (h) {
        document.body.style.paddingTop = h.classList.contains('is-overlay') ? '' : h.offsetHeight + 'px';
      });
    }
    window.addEventListener('load', offset);
    window.addEventListener('resize', offset);
    document.addEventListener('shopify:section:load', offset);
    if (document.readyState !== 'loading') offset();
    else document.addEventListener('DOMContentLoaded', offset);
  }

  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);

  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target.querySelector ? e.target.querySelector('[data-op-header]') : null;
    if (!el && e.target.matches && e.target.matches('[data-op-header]')) el = e.target;
    if (el) { el.__opHeaderInit = false; initHeader(el); }
  });
})();
