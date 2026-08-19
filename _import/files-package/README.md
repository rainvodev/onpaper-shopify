# Paquete para Shopify Files — mockups por color

**Qué es:** los 528 mockups de producto (Photobook Tradicional, Photobook Layflat,
Libro de Firmas y Book case) en todos sus colores de Tela (26) y Vinipiel (18),
en las 3 orientaciones, optimizados (≤1400 px, webp, ~120 KB c/u, 61 MB total).

**Cómo subirlos (una sola vez, ~2 min):**
1. Admin → Content → **Files** → botón **Upload files**.
2. Selecciona/arrastra **todos** los `.webp` de la carpeta `mockups/` de un jalón
   (Shopify acepta cientos de archivos por subida y conserva los nombres).
3. Listo: la página de producto los detecta sola — al elegir Material + Tamaño +
   Color, la imagen principal cambia al mockup correspondiente
   (`op-product.js` sondea `<handle>-<material>-<orientación>-<color>.webp`).

**Importante:**
- Subirlos en la tienda **definitiva** (los Files no se transfieren entre tiendas).
- NO renombrar los archivos: el nombre es la llave del swap.
- Vinipiel "Rosa metálico" y "Azul metálico" no tienen mockup (así vino del taller):
  al elegirlos se conserva la última imagen — comportamiento esperado.
