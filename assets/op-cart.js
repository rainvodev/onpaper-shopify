/* On Paper — Cart drawer. AJAX add/change/remove con render 100% client-side desde /cart.js
   (fiable en tiempo real, sin depender del Section Rendering de una sección del layout).
   Muestra la variante elegida y evita duplicar las opciones como properties. */
(function () {
  'use strict';

  function root() { return document.querySelector('[data-op-cart]'); }

  function open() {
    var r = root(); if (!r) return;
    r.classList.add('is-open'); r.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('op-no-scroll');
    if (window.lenis) window.lenis.stop();
  }
  function close() {
    var r = root(); if (!r) return;
    r.classList.remove('is-open'); r.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('op-no-scroll');
    if (window.lenis) window.lenis.start();
  }
  function updateBadge(count) {
    document.querySelectorAll('[data-op-cart-badge]').forEach(function (b) { b.textContent = count; });
  }

  function esc(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function money(cents) {
    var r = root();
    var fmt = ((r && r.getAttribute('data-op-money')) || '${{amount}}').replace(/<[^>]+>/g, '');
    var s = (Number(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return fmt.replace(/\{\{\s*amount[^}]*\}\}/g, s);
  }
  function label(r, key, fallback) { return (r && r.getAttribute('data-l-' + key)) || fallback; }

  var CLOSE_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

  function renderCart(cart) {
    var cur = root(); if (!cur) return;
    updateBadge(cart.item_count);
    cur.setAttribute('data-op-cart-count-value', cart.item_count);

    var title = label(cur, 'title', 'Carrito');
    var html = '<div class="op-cart_overlay" data-op-cart-close></div>'
      + '<aside class="op-cart_panel" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">'
      + '<header class="op-cart_head"><span class="op-cart_title">' + esc(title) + ' (' + cart.item_count + ')</span>'
      + '<button type="button" class="op-cart_close" data-op-cart-close aria-label="Cerrar">' + CLOSE_SVG + '</button></header>';

    if (!cart.item_count) {
      html += '<div class="op-cart_empty"><p>' + esc(label(cur, 'empty', 'Tu carrito está vacío.')) + '</p>'
        + '<button type="button" class="op-cart_continue" data-op-cart-close>' + esc(label(cur, 'continue', 'Seguir comprando')) + '</button></div>';
    } else {
      html += '<div class="op-cart_items" data-lenis-prevent>';
      cart.items.forEach(function (it, i) {
        var line = i + 1;
        var optNames = (it.options_with_values || []).map(function (o) { return o.name; });
        var variant = (it.options_with_values || [])
          .filter(function (o) { return o.value && o.value !== 'Default Title'; })
          .map(function (o) { return esc(o.value); }).join(' / ');
        var props = '';
        Object.keys(it.properties || {}).forEach(function (k) {
          var v = it.properties[k];
          if (!v || k.charAt(0) === '_' || optNames.indexOf(k) > -1) return;
          props += '<li><span>' + esc(k) + ':</span> ' + esc(v) + '</li>';
        });
        var imgUrl = it.image ? it.image + (it.image.indexOf('?') > -1 ? '&' : '?') + 'width=240' : null;
        var media = imgUrl
          ? '<img class="op-cart_item-img" src="' + esc(imgUrl) + '" alt="' + esc(it.product_title) + '" loading="lazy">'
          : '<span class="op-cart_item-img op-cart_item-img--ph"></span>';
        html += '<div class="op-cart_item" data-line="' + line + '">'
          + '<a href="' + esc(it.url) + '" class="op-cart_item-media">' + media + '</a>'
          + '<div class="op-cart_item-info">'
          + '<a href="' + esc(it.url) + '" class="op-cart_item-title">' + esc(it.product_title) + '</a>'
          + (variant ? '<div class="op-cart_item-variant">' + variant + '</div>' : '')
          + (props ? '<ul class="op-cart_item-props">' + props + '</ul>' : '')
          + '<div class="op-cart_item-bottom"><div class="op-cart_qty">'
          + '<button type="button" data-op-cart-minus aria-label="Restar">&#8211;</button>'
          + '<span class="op-cart_qty-val" data-op-cart-qtyval>' + it.quantity + '</span>'
          + '<button type="button" data-op-cart-plus aria-label="Sumar">+</button></div>'
          + '<span class="op-cart_item-price">' + money(it.final_line_price) + '</span></div>'
          + '<button type="button" class="op-cart_remove" data-op-cart-remove>' + esc(label(cur, 'remove', 'Quitar')) + '</button>'
          + '</div></div>';
      });
      html += '</div>';
      html += '<footer class="op-cart_foot"><div class="op-cart_subtotal"><span>' + esc(label(cur, 'subtotal', 'Subtotal'))
        + '</span><span>' + money(cart.total_price) + '</span></div>'
        + '<form action="/cart" method="post"><button type="submit" name="checkout" class="op-cart_checkout">' + esc(label(cur, 'checkout', 'Finalizar compra')) + '</button></form>'
        + '<a href="/cart" class="op-cart_view">' + esc(label(cur, 'view', 'Ver carrito')) + '</a></footer>';
    }
    html += '</aside>';

    var wasOpen = cur.classList.contains('is-open');
    cur.innerHTML = html;
    if (wasOpen) cur.classList.add('is-open');
  }

  function fetchCart() {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' }, cache: 'no-store' }).then(function (r) { return r.json(); });
  }

  function changeLine(line, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty })
    }).then(function (r) { return r.json(); }).then(renderCart).catch(function () {});
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches || !form.matches('form[action*="/cart/add"]')) return;
    e.preventDefault();
    var btn = form.querySelector('[name="add"]');
    if (btn) btn.setAttribute('disabled', '');
    fetch('/cart/add.js', { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('add'); return r.json(); })
      .then(fetchCart)
      .then(function (cart) { renderCart(cart); open(); })
      .catch(function () { form.submit(); })
      .finally(function () { if (btn) btn.removeAttribute('disabled'); });
  });

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
