# On Paper — Theme Shopify

Theme OS 2.0 custom de **On Paper** (taller artesanal de photobooks e impresión, Monterrey MX), construido sobre el **Skeleton** de Shopify + el framework **Lumos** de RAINVO.

- **Store actual (dev, temporal):** onpaper-fafjay65.myshopify.com — dev store NO transferible.
- **Store definitivo:** `<store-onpaper>.myshopify.com` *(actualizar cuando se confirme la URL)*. Migración: ver `docs/migracion.md`.
- **Transferencia al lanzamiento:** la tienda queda a nombre de taller@onpaper.mx (Anaissa activa el plan de pago).

## Modelo de deploy

El repo se conecta a la tienda con la **integración GitHub de Shopify** (Admin → Online Store → Themes → Add theme → Connect from GitHub → rama `main`). Cada push a `main` se publica automáticamente en el theme conectado, y los cambios del editor de themes regresan como commits de `shopify[bot]`. **No hay build step**: todo es Liquid/CSS/JS committeado.

Desarrollo local (opcional): Shopify CLI (`npm i -g @shopify/cli`), `shopify theme dev --store <store>` y `shopify theme check` (mismo check que corre el CI en cada push).

## Precios y variantes (cómo funciona)

**Todos los productos cobran por variantes nativas de Shopify.** La única fuente de verdad de precios es **`_import/products-variants.csv`** (245 variantes, 9 productos). El precio que se muestra en la página siempre es el de la variante seleccionada (`assets/op-variants.js`), así que precio mostrado = precio cobrado.

Estado de los montos (catálogo oficial ago-2026):

| Producto | Precios | Estado |
|---|---|---|
| Photobook Tradicional / Layflat, Bookcase, Memory Box, Fotos Impresas | **REALES** (tablas del catálogo) | `active` |
| Libro de Firmas, Cajas Personalizadas, Carpetas, Porta Planos | **DUMMY** (pendientes de Anaissa) | `draft` — no publicar hasta tener montos |
| Certificado de Regalo | Gift card **nativa** de Shopify | crear en Admin (no va por CSV) |

**Para reemplazar los dummy:** editar los mapas `FIRMAS_*`, `CAJAS_*`, `CARP_*`, `PORTA_*`/`MAT3`/`HERRAJE` en el generador (`docs/migracion.md` explica dónde vive), regenerar el CSV, re-importar en Admin con *Overwrite products with matching handles* y cambiar Status a `active`.

La personalización que no afecta precio (Color, Hotstamping, títulos, links de fotos) viaja como **line-item properties** y aparece en el pedido.

## Paletas y swap de imagen por color

- Paletas oficiales del catálogo en `snippets/op-swatches.liquid` (Telas 19 · Vinipieles 17 · Telas Plastificadas 6 · Papel Texturizado 14 · Hotstamping 8). El **nombre del color viaja al pedido**: no renombrar sin avisar al taller.
- La paleta visible depende del Material elegido (setting `show_for` del bloque swatch; lógica en `assets/op-product.js`).
- **Imagen por color:** al elegir un color, la imagen principal cambia a
  1) la media del producto cuyo **alt = nombre exacto del color**, o
  2) el asset **`assets/<handle>-<slug-del-color>.jpg`** (slug: minúsculas, sin acentos, espacios→`-`; ej. `libro-de-firmas-verde-militar.jpg`).
  Si no existe ninguna, se conserva la imagen actual.
- Texturas de swatches: subir a Admin → Content → Files como `swatch-<slug>.jpg` (slugs en `op-swatches.liquid`; se pueden exportar de los PDFs del catálogo).

## Estructura relevante

- `sections/op-*.liquid` — kit custom On Paper (header mega-menú, footer, hero, contacto, FAQ, cart drawer…).
- `sections/product.liquid` + `templates/product.<handle>.json` — página de producto por bloques.
- `locales/es.default.json` — idioma principal **Español** (configurarlo también en Admin → Settings → Languages).
- `_import/products-variants.csv` — import completo de productos + variantes.
- `docs/migracion.md` — runbook de migración al store definitivo + checklist de operación.
- `docs/precios-spec.md`, `docs/productos.md` — especificación histórica (ver notas de vigencia al inicio de cada uno).

## Pendientes para operar

La lista viva está en **`docs/migracion.md`** (checklist Admin + cliente). Resumen: montos reales de los 4 productos en draft, gift card nativa, migración al store definitivo, imágenes por color y texturas de swatches, páginas/colecciones/menús/políticas en Admin, pagos/envíos/impuestos, plan de pago y transferencia.
