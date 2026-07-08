/* On Paper — Motor de precios en vivo. Lee window.OP_PRICING[handle] (assets/op-pricing-data.js)
   y recalcula el precio mostrado en la página de producto según las opciones (line-item properties)
   elegidas. Escucha cambios en el formulario (pickers, selects, steppers, textos).

   ⚠️ Solo actualiza el precio MOSTRADO. Cobrar ese precio ajustado requiere un mecanismo de backend
   (Shopify Functions / draft orders / add-ons), ya que el carrito nativo cobra por variante, no por
   line-item property. Ver docs/precios-spec.md.

   Re-init en shopify:section:load. */
(function () {
  'use strict';

  function num(v) { v = parseFloat(v); return isNaN(v) ? 0 : v; }

  function getEl(form, label) {
    return form.querySelector('[name="properties[' + label + ']"]');
  }

  function moneyFormatter(root) {
    var fmt = (root.getAttribute('data-op-money') || '${{amount}}').replace(/<[^>]+>/g, '');
    return function (v) {
      var s = Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return fmt.replace(/\{\{\s*amount[^}]*\}\}/g, s);
    };
  }

  function compute(root, cfg, form, money) {
    var mode = cfg.mode || 'sum';

    if (mode === 'amount') {
      var giftEl = getEl(form, cfg.giftProp);
      var amtEl = getEl(form, cfg.amountProp);
      if (giftEl && giftEl.value === cfg.optionB) {
        var amt = num(amtEl && amtEl.value);
        return amt > 0 ? money(amt) : (cfg.placeholderB || 'Escribe el monto…');
      }
      return cfg.noteA || '—';
    }

    if (mode === 'unit_qty') {
      var sizeEl = getEl(form, cfg.unitProp);
      var map = (cfg.rules[cfg.unitProp] || {}).map || {};
      var unit = num(map[sizeEl && sizeEl.value]);
      var qtyEl = form.querySelector('[name="' + (cfg.qtyName || 'quantity') + '"]');
      var qty = Math.max(1, parseInt(qtyEl && qtyEl.value, 10) || 1);
      return money(unit * qty);
    }

    // mode 'sum'
    var total = num(cfg.base);
    var rules = cfg.rules || {};
    Object.keys(rules).forEach(function (label) {
      var rule = rules[label];
      var el = getEl(form, label);
      if (!el) return;
      if (rule.map) total += num(rule.map[el.value]);
      else if (rule.perUnit != null) total += num(rule.perUnit) * num(el.value);
      else if (rule.nonEmpty != null && el.value && el.value.trim()) total += num(rule.nonEmpty);
    });
    return money(total);
  }

  function initPricing(root) {
    if (!root || root.__opPricingInit) return;
    if (root.hasAttribute('data-op-variant-mode')) return; // variantes nativas → el precio lo maneja op-variants.js
    var handle = root.getAttribute('data-op-handle');
    var cfg = window.OP_PRICING && handle && window.OP_PRICING[handle];
    if (!cfg) return; // sin config → conserva el precio de Shopify
    var form = root.querySelector('#opProductForm') || root.querySelector('form');
    var target = root.querySelector('[data-op-price-amount]');
    if (!form || !target) return;
    root.__opPricingInit = true;

    var money = moneyFormatter(root);
    var recalc = function () { target.textContent = compute(root, cfg, form, money); };

    form.addEventListener('change', recalc);
    form.addEventListener('input', recalc);
    recalc(); // precio inicial según defaults
  }

  function initAll() { document.querySelectorAll('.op-product[data-op-handle]').forEach(initPricing); }
  if (document.readyState !== 'loading') initAll();
  else document.addEventListener('DOMContentLoaded', initAll);

  document.addEventListener('shopify:section:load', function (e) {
    var el = e.target.querySelector ? e.target.querySelector('.op-product[data-op-handle]') : null;
    if (!el && e.target.matches && e.target.matches('.op-product')) el = e.target;
    if (el) { el.__opPricingInit = false; initPricing(el); }
  });
})();
