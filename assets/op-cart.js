/* On Paper — Cart drawer. AJAX add/change/remove + re-render vía Section Rendering API. */
(function () {
  'use strict';
  var SECTION = 'op-cart-drawer';

  function root() { return document.querySelector('[data-op-cart]'); }

  function open() {
    var r = root(); if (!r) return;
    r.classList.add('is-open');
    r.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('op-no-scroll');
    if (window.lenis) window.lenis.stop();
  }
  function close() {
    var r = root(); if (!r) return;
    r.classList.remove('is-open');
    r.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('op-no-scroll');
    if (window.lenis) window.lenis.start();
  }
  function updateBadge(count) {
    document.querySelectorAll('[data-op-cart-badge]').forEach(function (b) { b.textContent = count; });
  }

  function refresh(cb) {
    fetch(window.location.pathname + '?sections=' + SECTION, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var html = data[SECTION];
        if (html == null) { if (cb) cb(); return; }
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var fresh = tmp.querySelector('[data-op-cart]');
        var cur = root();
        if (fresh && cur) {
          var wasOpen = cur.classList.contains('is-open');
          cur.innerHTML = fresh.innerHTML;
          if (wasOpen) { cur.classList.add('is-open'); cur.setAttribute('aria-hidden', 'false'); }
          var count = fresh.getAttribute('data-op-cart-count-value');
          if (count !== null) { cur.setAttribute('data-op-cart-count-value', count); updateBadge(count); }
        }
        if (cb) cb();
      })
      .catch(function () { if (cb) cb(); });
  }

  function changeLine(line, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty })
    }).then(function (r) { return r.json(); }).then(function () { refresh(); });
  }

  // Agregar al carrito (intercepta el form de producto)
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches || !form.matches('form[action*="/cart/add"]')) return;
    e.preventDefault();
    var btn = form.querySelector('[name="add"]');
    if (btn) btn.setAttribute('disabled', '');
    fetch('/cart/add.js', { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function () { refresh(function () { open(); }); })
      .catch(function () { form.submit(); })
      .finally(function () { if (btn) btn.removeAttribute('disabled'); });
  });

  // Delegación: abrir/cerrar, qty, quitar
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-op-cart-open]')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-op-cart-close]')) { e.preventDefault(); close(); return; }
    var item = e.target.closest('[data-line]');
    if (item) {
      var line = parseInt(item.getAttribute('data-line'), 10);
      var valEl = item.querySelector('[data-op-cart-qtyval]');
      var q = valEl ? (parseInt(valEl.textContent, 10) || 0) : 0;
      if (e.target.closest('[data-op-cart-remove]')) { e.preventDefault(); changeLine(line, 0); return; }
      if (e.target.closest('[data-op-cart-plus]')) { e.preventDefault(); changeLine(line, q + 1); return; }
      if (e.target.closest('[data-op-cart-minus]')) { e.preventDefault(); changeLine(line, Math.max(0, q - 1)); return; }
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
