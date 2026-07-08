/* On Paper — Selección de variante nativa en la página de producto. Para productos con variantes
   (tamaño/diseño/fotos, etc.), mapea las opciones elegidas → la variante real de Shopify, actualiza
   el input hidden [name="id"] y el precio mostrado (precio de la variante). Así el checkout cobra por
   opción de verdad. Las opciones que NO son variantes (color, material libre, etc.) siguen como
   line-item properties. Convención: el nombre de la opción de Shopify == la etiqueta del campo en el
   formulario (properties[<nombre>]). Re-init en shopify:section:load. */
(function () {
  'use strict';

  function moneyFmt(root) {
    var fmt = (root.getAttribute('data-op-money') || '${{amount}}').replace(/<[^>]+>/g, '');
    return function (cents) {
      var s = (Number(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return fmt.replace(/\{\{\s*amount[^}]*\}\}/g, s);
    };
  }

  function initVariants(root) {
    if (!root || root.__opVariantInit) return;
    if (!root.hasAttribute('data-op-variant-mode')) return;
    var vEl = root.querySelector('[data-op-variants]');
    var oEl = root.querySelector('[data-op-options]');
    if (!vEl || !oEl) return;
    var variants, options;
    try { variants = JSON.parse(vEl.textContent); options = JSON.parse(oEl.textContent); }
    catch (e) { return; }
    if (!variants || !variants.length || !options || !options.length) return;

    var form = root.querySelector('#opProductForm') || root.querySelector('form');
    if (!form) return;
    var idInput = form.querySelector('[name="id"]');
    var priceEls = root.querySelectorAll('[data-op-price-amount]');
    var addBtn = form.querySelector('[name="add"]');
    var money = moneyFmt(root);
    root.__opVariantInit = true;

    function selectedValue(optName) {
      var el = form.querySelector('[name="properties[' + optName + ']"]');
      return el ? el.value : null;
    }

    function matchVariant() {
      return variants.find(function (v) {
        for (var i = 0; i < options.length; i++) {
          var want = selectedValue(options[i]);
          if (want != null && want !== v['option' + (i + 1)]) return false;
        }
        return true;
      });
    }

    function update() {
      var v = matchVariant();
      if (!v) {
        if (addBtn) { addBtn.setAttribute('disabled', ''); }
        return;
      }
      if (idInput) idInput.value = v.id;
      if (v.price != null) { var m = money(v.price); priceEls.forEach(function (el) { el.textContent = m; }); }
      if (addBtn) { if (v.available === false) addBtn.setAttribute('disabled', ''); else addBtn.removeAttribute('disabled'); }
    }

    form.addEventListener('change', update);
    update();
  }

  function initAll() { document.querySelectorAll('.op-product[data-op-variant-mode]').forEach(initVariants); }
  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);

  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target.querySelector ? e.target.querySelector('.op-product[data-op-variant-mode]') : null;
    if (!el && e.target.matches && e.target.matches('.op-product')) el = e.target;
    if (el) { el.__opVariantInit = false; initVariants(el); }
  });
})();
