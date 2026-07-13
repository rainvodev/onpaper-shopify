/* On Paper — Header mega-menú. Hover/click abre paneles; hover en item izquierdo cambia los 3 productos;
   Esc / click afuera cierra; drawer en móvil. Re-attach en shopify:section:load. */
(function () {
  'use strict';

  function closeRoot(root) {
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
      Object.keys(panels).forEach(function (k) { panels[k].classList.toggle('is-open', k === name); });
      root.classList.add('is-menu-open');
      triggers.forEach(function (t) {
        var on = t.getAttribute('data-op-trigger') === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      root.__opCurrent = name;
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
      burger.addEventListener('click', function () {
        var isOpen = drawer.classList.toggle('is-open');
        root.classList.toggle('is-drawer-open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.documentElement.classList.toggle('op-no-scroll', isOpen);
        if (window.lenis) { isOpen ? window.lenis.stop() : window.lenis.start(); }
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

  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);

  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target.querySelector ? e.target.querySelector('[data-op-header]') : null;
    if (!el && e.target.matches && e.target.matches('[data-op-header]')) el = e.target;
    if (el) { el.__opHeaderInit = false; initHeader(el); }
  });
})();
