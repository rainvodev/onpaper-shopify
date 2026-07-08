/* On Paper — Página de producto. Galería (thumb swap), pickers (pills/swatch/size/radio) → hidden input,
   stepper +/-, toggle del giftcard. Re-init en shopify:section:load. */
(function () {
  'use strict';

  function initProduct(root) {
    if (!root || root.__opProductInit) return;
    root.__opProductInit = true;

    // Galería
    var main = root.querySelector('#opMainImg');
    root.querySelectorAll('[data-op-thumb]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (main && btn.dataset.full) { main.src = btn.dataset.full; main.removeAttribute('srcset'); }
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

    // Steppers
    root.querySelectorAll('[data-op-stepper]').forEach(function (stepper) {
      var input = stepper.querySelector('input');
      if (!input) return;
      stepper.querySelectorAll('button[data-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var min = parseInt(input.min, 10) || 1;
          var val = parseInt(input.value, 10) || min;
          val += parseInt(btn.getAttribute('data-step'), 10);
          if (val < min) val = min;
          input.value = val;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
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
