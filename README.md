# On Paper — Theme Shopify

Theme OS 2.0 custom de **On Paper** (taller artesanal de photobooks e impresión, Monterrey MX), construido por RAINVO sobre el **Skeleton** de Shopify + el framework **Lumos**.

- **Tienda:** `on-paper-t6vfjrak.myshopify.com` (dominio `onpaper.mx` al lanzar). El dev store viejo `onpaper-fafjay65` se abandona.
- **Propiedad:** al lanzamiento la tienda se transfiere a `taller@onpaper.mx`.
- **Para Claude / nuevos colaboradores:** empieza por **`CLAUDE.md`** y **`docs/handoff.md`**.

## Documentación

| Archivo | Contenido |
|---|---|
| `CLAUDE.md` | Guía de entrada para Claude Code: reglas esenciales, estructura, comandos, convenciones |
| `docs/handoff.md` | Diagnóstico del sitio y plan de entrega (sep-2026) |
| `docs/reglas.md` | Reglas duras del proyecto y su porqué |
| `docs/styleguide.md` | Marca: color, tipografía, espaciado, movimiento, voz |
| `docs/componentes.md` | Arquitectura + catálogo de secciones, bloques, snippets, assets, templates |
| `docs/elementos.md` | Elementos de UI con clases y estados |
| `docs/usos.md` | Recetas: contenido, productos, precios, colores, idiomas, código |
| `docs/migracion.md` | Runbook del Admin (checklist de configuración y lanzamiento) |
| `docs/imagenes-spec.md` | Pipeline y convenciones de imágenes |
| `docs/precios-spec.md`, `docs/productos.md` | Históricos (superados) |

## Modelo de deploy

El repo está conectado con la **integración GitHub de Shopify**: cada push a `main` se publica en el theme conectado, y los cambios del editor (Personalizar, idiomas, editor de código) regresan como commits de `shopify[bot]`. **No hay build step.** Antes de pushear: `git pull --no-rebase origin main` y `theme check` con 0 errores (el CI lo corre en cada push).

Desarrollo local opcional: `npm i -g @shopify/cli`, `shopify theme dev --store on-paper-t6vfjrak.myshopify.com`, `shopify theme check`.

## Precios y variantes

**Todos los productos cobran por variantes nativas de Shopify.** La única fuente de precios es `_import/products-variants.csv`, generado por `_import/gen_variants_csv.py` (245 variantes, 9 productos). El PDP muestra el precio de la variante seleccionada (`assets/op-variants.js`): precio mostrado = precio cobrado. La personalización sin costo (Color, Hotstamping, títulos, links) viaja como line-item properties.

| Producto | Precios | Estado en el CSV |
|---|---|---|
| Photobook Tradicional / Layflat, Bookcase, Memory Box, Fotos Impresas | **Reales** (catálogo ago-2026) | `active` |
| Libro de Firmas, Cajas Personalizadas, Carpetas, Porta Planos | **Dummy** (pendientes de Anaissa) | `draft` — no vender hasta tener montos |
| Certificado de Regalo | Producto normal con bloque "Producto" (template `giftcard`) | Se gestiona en Admin |

Reemplazo de dummy: receta en `docs/usos.md` → "Cambiar precios".

## Paletas e imagen por color

- Paletas oficiales del taller en `snippets/op-swatches.liquid`: Telas 26 · Vinipieles 18 (+2 metálicos ocultos hasta tener mockups) · Telas plastificadas 6 · Papel texturizado 14 · Hotstamping 7. Texturas en `assets/swatch-<paleta>-<slug>.webp`. **El nombre del color viaja al pedido: no renombrar.**
- La paleta visible depende del Material (`show_for` del bloque swatch; `assets/op-product.js`).
- Al elegir un color la imagen principal cambia al mockup `mockup-<material>-<tamaño>-<color>.webp` de Shopify Files (tamaño en convención ALTO×ANCHO del taller; el theme traduce), con fallbacks a assets y a la media del producto con `alt` = color. Con Impresión vuelve la foto original.

## Estructura

- `sections/op-*.liquid` — kit On Paper (header con mega-menú y búsqueda, footer, hero, about, bookcase, galería, CTA, FAQ, contacto, cart drawer).
- `sections/product.liquid` + `templates/product.<handle>.json` — página de producto por bloques.
- `assets/op-*.js` — header, producto, variantes, carrito, animación, transición, cursor.
- `assets/brand.css` — tokens de marca (sobre `lumos.css`, que no se edita).
- `locales/es.default.json` (principal) y `locales/en.json` (inglés).
- `_import/` — CSV de productos, generador de precios, manifest de imágenes.
