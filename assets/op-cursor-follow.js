/* On Paper — cursor-follow disc. Zona: [data-cursor-follow]; disco: [data-cursor-disc].
   Movimiento suave por lerp (rAF) + transform GPU; aparece/desaparece con .is-active (opacidad CSS).
   No se activa en táctil; respeta prefers-reduced-motion (sin inercia). */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = reduce ? 1 : 0.18;

  function setup(zone) {
    var disc = zone.querySelector('[data-cursor-disc]');
    if (!disc || zone.dataset.cfReady === '1') return;
    zone.dataset.cfReady = '1';
    var tx = 0, ty = 0, cx = 0, cy = 0, active = false, raf = null;

    function render() {
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      disc.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0) translate(-50%,-50%)';
      if (active || Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(render); }

    zone.addEventListener('pointerenter', function (e) {
      var r = zone.getBoundingClientRect();
      tx = cx = e.clientX - r.left;
      ty = cy = e.clientY - r.top;
      active = true;
      disc.classList.add('is-active');
      kick();
    });
    zone.addEventListener('pointermove', function (e) {
      var r = zone.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      kick();
    });
    zone.addEventListener('pointerleave', function () {
      active = false;
      disc.classList.remove('is-active');
    });
  }

  function init(root) {
    (root || document).querySelectorAll('[data-cursor-follow]').forEach(setup);
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', function () { init(); });
  /* re-attach al recargar secciones en el editor de Shopify */
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
