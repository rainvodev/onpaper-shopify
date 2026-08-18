/* On Paper — Fallback de precios por line-item properties (op-pricing.js).

   DESDE AGO-2026 LOS 9 PRODUCTOS COBRAN POR VARIANTES NATIVAS DE SHOPIFY:
   la única fuente de verdad de precios es `_import/products-variants.csv`
   (importar en Admin con "Overwrite products with matching handles").
   En modo variante op-pricing.js no interviene (ver op-variants.js).

   Este objeto queda vacío a propósito: si un producto aún no tiene sus
   variantes importadas, la página muestra el precio plano de Shopify en vez
   de un total calculado que el carrito no podría cobrar.

   Estado de precios (catálogo oficial ago-2026):
   - REALES: photobook-tradicional, photobook-layflat, bookcase, memory-box,
     fotos-impresas (+ envíos: nacional $300 / MTY $100 / pickup San Pedro).
   - DUMMY (draft, pendientes de Anaissa): libro-de-firmas,
     cajas-personalizadas, carpetas, porta-planos.
   - certificado-de-regalo: usar la gift card NATIVA de Shopify con
     denominaciones (opción "Valor"); no se cobra por properties. */
window.OP_PRICING = {};
