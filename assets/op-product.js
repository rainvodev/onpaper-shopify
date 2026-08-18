/* On Paper — Página de producto. Galería (thumb swap), pickers (pills/swatch/size/radio) → hidden input,
   stepper +/-, toggle del giftcard. Re-init en shopify:section:load. */
(function () {
  'use strict';

  function moneyFmt(root) {
    var fmt = (root.getAttribute('data-op-money') || '${{amount}}').replace(/<[^>]+>/g, '');
    return function (cents) {
      var s = (Number(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return fmt.replace(/\{\{\s*amount[^}]*\}\}/g, s);
    };
  }

  function initProduct(root) {
    if (!root || root.__opProductInit) return;
    root.__opProductInit = true;

    // Total en tiempo real: precio unitario (variante) × cantidad.
    var money = moneyFmt(root);
    var priceEls = root.querySelectorAll('[data-op-price-amount]');
    var qtyInput = root.querySelector('[name="quantity"]');
    function unitPrice() { return parseInt(root.getAttribute('data-op-unit-price'), 10) || 0; }
    function currentQty() {
      var min = qtyInput ? (parseInt(qtyInput.min, 10) || 1) : 1;
      var q = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      return (isNaN(q) || q < min) ? min : q;
    }
    function renderTotal() {
      if (!priceEls.length) return;
      var m = money(unitPrice() * currentQty());
      priceEls.forEach(function (el) { el.textContent = m; });
    }
    // Recalcular al cambiar cantidad y cuando la variante actualice el precio unitario.
    if (qtyInput) {
      qtyInput.addEventListener('change', renderTotal);
      qtyInput.addEventListener('input', renderTotal);
    }
    root.addEventListener('op:unitprice', renderTotal);

    // Galería
    var main = root.querySelector('#opMainImg');
    root.querySelectorAll('[data-op-thumb]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (main && btn.dataset.full) {
          main.src = btn.dataset.full;
          // Conserva srcset responsivo si el thumb lo trae (evita cargar 1400px en móvil)
          if (btn.dataset.srcset) main.setAttribute('srcset', btn.dataset.srcset);
          else main.removeAttribute('srcset');
        }
        root.querySelectorAll('[data-op-thumb]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
      });
    });

    // Pickers de selección única (pills, swatches, sizes, radios, gift)
    root.querySelectorAll('[data-op-picker]').forEach(function (picker) {
      var input = picker.querySelector('input[type="hidden"]');
      var opts = picker.querySelectorAll('[data-val]');
      opts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          opts.forEach(function (o) { o.classList.remove('is-active'); });
          opt.classList.add('is-active');
          if (input) { input.value = opt.getAttribute('data-val'); input.dispatchEvent(new Event('change', { bubbles: true })); }
          if (picker.hasAttribute('data-op-gift')) toggleGift(picker, opt.getAttribute('data-gift'));
        });
      });
    });

    // Giftcard: mostrar pane A (producto) o B (monto)
    function toggleGift(picker, which) {
      var field = picker.closest('.op-product_field');
      if (!field) return;
      field.querySelectorAll('[data-gift-pane]').forEach(function (pane) {
        pane.hidden = pane.getAttribute('data-gift-pane') !== which;
      });
    }

    // Steppers (respetan min/max; muestran aviso al alcanzar el tope)
    root.querySelectorAll('[data-op-stepper]').forEach(function (stepper) {
      var input = stepper.querySelector('input');
      if (!input) return;
      var msg = stepper.closest('.op-product_field') ?
        stepper.closest('.op-product_field').querySelector('[data-op-qty-msg]') : null;
      function clamp(val) {
        var min = parseInt(input.min, 10) || 1;
        var max = parseInt(input.max, 10);
        var capped = false;
        if (val < min) val = min;
        if (!isNaN(max) && val > max) { val = max; capped = true; }
        if (msg) msg.hidden = !capped;
        return val;
      }
      stepper.querySelectorAll('button[data-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var min = parseInt(input.min, 10) || 1;
          var val = parseInt(input.value, 10) || min;
          val += parseInt(btn.getAttribute('data-step'), 10);
          input.value = clamp(val);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
      // Al teclear un valor manualmente también se respeta el tope.
      input.addEventListener('change', function () {
        var v = clamp(parseInt(input.value, 10) || (parseInt(input.min, 10) || 1));
        if (String(v) !== input.value) input.value = v;
      });
    });

    // Paletas dependientes del material: muestra solo el grupo cuyo data-op-dep-values
    // incluye el valor actual del campo controlador, y DESHABILITA los inputs de los
    // grupos ocultos para que un único properties[Color] viaje al carrito.
    var form = root.querySelector('#opProductForm') || root.querySelector('form');
    var deps = root.querySelectorAll('[data-op-dep]');
    function applyDeps() {
      deps.forEach(function (dep) {
        var prop = dep.getAttribute('data-op-dep-prop');
        var ctrl = form ? form.querySelector('[name="properties[' + prop + ']"]') : null;
        var values = (dep.getAttribute('data-op-dep-values') || '').split(',').map(function (s) { return s.trim(); });
        var show = !!ctrl && values.indexOf(ctrl.value) !== -1;
        dep.hidden = !show;
        dep.querySelectorAll('input, select, textarea').forEach(function (i) { i.disabled = !show; });
      });
    }
    if (deps.length && form) {
      applyDeps();
      form.addEventListener('change', applyDeps);
    }

    // Imagen por color: primero busca media del producto con alt == color; si no hay,
    // intenta assets/<handle>-<slug>.jpg (convención del repo). Fallback: no cambia nada.
    var imgBase = root.getAttribute('data-op-img-base') || '';
    var imgPrefix = root.getAttribute('data-op-img-prefix') || '';
    var mediaEl = root.querySelector('[data-op-color-media]');
    var mediaList = [];
    if (mediaEl) { try { mediaList = JSON.parse(mediaEl.textContent) || []; } catch (e) { mediaList = []; } }
    function slug(s) {
      return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function mainImgEl() { return root.querySelector('#opMainImg'); }
    function swapMain(src, srcset) {
      var img = mainImgEl();
      if (!img) {
        // Producto sin media: sustituye el placeholder por una imagen real.
        var ph = root.querySelector('[data-op-main-ph]');
        if (!ph) return;
        img = document.createElement('img');
        img.id = 'opMainImg';
        img.className = 'op-product_mainimg';
        img.alt = '';
        ph.replaceWith(img);
      }
      img.src = src;
      if (srcset) img.setAttribute('srcset', srcset);
      else img.removeAttribute('srcset');
    }
    function colorImage(value) {
      if (!value) return;
      var target = slug(value);
      var m = mediaList.filter(function (it) { return it.alt && slug(it.alt) === target; })[0];
      if (m) { swapMain(m.src, m.srcset || ''); return; }
      if (!imgBase || !imgPrefix) return;
      var url = imgBase + imgPrefix + target + '.jpg';
      var probe = new Image();
      probe.onload = function () { swapMain(url, ''); };
      probe.src = url; // si no existe el asset, onerror silencioso: se conserva la imagen actual
    }
    function activeColorValue() {
      var el = null;
      root.querySelectorAll('[name="properties[Color]"]').forEach(function (i) { if (!i.disabled) el = i; });
      return el ? el.value : null;
    }
    if (form && (mediaList.length || (imgBase && imgPrefix))) {
      form.addEventListener('change', function (e) {
        var name = e.target && e.target.name;
        if (name === 'properties[Color]') colorImage(e.target.value);
        else if (deps.length && name && name.indexOf('properties[') === 0) {
          // p. ej. cambio de Material → la paleta activa cambió; refleja su color vigente
          var v = activeColorValue();
          if (v) colorImage(v);
        }
      });
      var initial = activeColorValue();
      if (initial) colorImage(initial);
    }

    // Barra flotante: mostrar cuando el precio principal sale de la vista
    var priceMain = root.querySelector('.op-product_price');
    var sticky = root.querySelector('[data-op-sticky]');
    if (priceMain && sticky && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var show = !e.isIntersecting;
          sticky.classList.toggle('is-visible', show);
          sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      }, { threshold: 0 });
      io.observe(priceMain);
    }

    renderTotal();
  }

  function initAll() { document.querySelectorAll('.op-product').forEach(initProduct); }
  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);

  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target.querySelector ? e.target.querySelector('.op-product') : null;
    if (!el && e.target.matches && e.target.matches('.op-product')) el = e.target;
    if (el) { el.__opProductInit = false; initProduct(el); }
  });
})();
