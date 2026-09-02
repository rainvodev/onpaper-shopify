# Componentes y arquitectura — On Paper

Cómo está armado el theme y qué hace cada pieza. Para el "cómo se usa" ver `docs/usos.md`; para la
apariencia, `docs/styleguide.md` y `docs/elementos.md`.

## 1. Capas (de afuera hacia adentro)

1. **Layout** `layout/theme.liquid`: `<head>` (fuentes Google, `critical.css`, `lumos.css`, `brand.css`,
   `lenis.css`, `op-anim.css`, meta tags, favicon), skip link, `{% sections 'header-group' %}`,
   `<main id="op-main">`, `{% sections 'footer-group' %}`, `{% section 'op-cart-drawer' %}`, scripts
   `defer` (Lenis, GSAP, ScrollTrigger, SplitText, `op-*.js`) e init de Lenis. En páginas que no son el
   home, `body.has-fixed-header` reserva el alto del header (evita salto de layout).
2. **Templates** `templates/*.json`: qué secciones y en qué orden. Cada producto tiene su template
   (`product.<handle>.json`) con los bloques de personalización.
3. **Section groups** `sections/header-group.json` y `footer-group.json`: los settings del header y footer.
4. **Secciones** `sections/*.liquid`: cada una con markup, `{% stylesheet %}` y `{% schema %}`.
5. **Bloques**: los del schema de cada sección (hero: `slide`; bookcase/galería: `image`; FAQ: `item`;
   producto: 13 tipos). `blocks/group.liquid` y `blocks/text.liquid` son los theme blocks de Skeleton (sin uso
   en el kit).
6. **Snippets** `snippets/op-*.liquid`: partials sin settings.

## 2. Flujos de datos clave

**Precio y variantes.** El CSV `_import/products-variants.csv` (generado por `_import/gen_variants_csv.py`)
define opciones y precios. En el PDP, cada bloque escribe `properties[<Label>]`; `assets/op-variants.js`
busca la variante cuyas opciones (mismo nombre que el label) coinciden, actualiza `input[name=id]`, el
precio (`[data-op-price-amount]`, evento `op:unitprice`) y marca combinaciones inexistentes. Las properties
que no son opción viajan al pedido como personalización sin costo. `op-pricing.js` + `op-pricing-data.js`
son un fallback vacío (precio visual por properties) que no debe usarse para cobrar.

**Paletas dependientes.** Un bloque `swatch` con `show_for: "Tela"` se envuelve en `[data-op-dep]`;
`op-product.js` muestra solo el grupo cuyo valor del campo `depends_on` (default `Material`) coincide y
deshabilita los inputs de los demás → un solo `properties[Color]` llega al carrito. Impresión no tiene
paleta: se ocultan Color y Hotstamping y la imagen vuelve a la foto original.

**Imagen por color.** Al elegir color (o cambiar Material/Tamaño) `op-product.js` construye la llave
`mockup-<material>-<tamaño-taller>-<slug-color>.webp` (mapa `TALLER_SIZE` traduce ANCHO×ALTO →
ALTO×ANCHO), la sondea en Shopify Files (`data-op-files-base`) → assets del theme → media del producto
con `alt` = nombre del color → llave corta, y si nada existe conserva la imagen. Con caché por llave,
precarga en hover y `?width=` por bucket. Solo hay mockups para Tela y Vinipiel (264 archivos); cajas,
carpetas y porta planos conservan su foto.

**Carrito.** `assets/op-cart.js` intercepta `form[action*="/cart/add"]`, hace `POST /cart/add.js`, lee
`/cart.js` y pinta el drawer 100 % en cliente (variante + properties visibles, +/−/quitar serializados,
resincroniza ante error). Abre con máscara y devuelve el foco al cerrar. La página `/cart`
(`sections/cart.liquid`) es la versión completa con nota y botones de pago express.

**Header.** `assets/op-header.js`: paneles por hover/click con cierre diferido 180 ms, stagger GSAP del
contenido, hover en la lista cambia las 3 mini cards, panel de búsqueda con Predictive Search API
(`/search/suggest.json`, debounce 220 ms), drawer móvil con máscara, hide-on-scroll con histéresis y
offset del body. Un panel de búsqueda abierto no se cierra por hover.

**Animación.** `assets/op-gsap.js` lee `data-reveal`, `data-split`, `data-mask`, `data-reveal-group`,
`data-reveal-load`, `data-parallax` y `--reveal-delay`; `op-anim.css` da el estado inicial sin FOUC;
`op-transition.js` la cortina entre páginas; `op-cursor-follow.js` el disco del cursor.

## 3. Catálogo de secciones

### Kit del home y páginas (todas con preset, se agregan desde el editor)

| Archivo | Nombre en editor | Qué hace | Settings clave | Bloques |
|---|---|---|---|---|
| `op-hero.liquid` | On Paper Hero | Slideshow full-bleed con título rich text, CTA y "More of us"; header transparente encima | `overlay`, `autoplay`, `content_width`, `heading`, `cta_*`, `more_*` | `slide` (imagen) |
| `op-about.liquid` | On Paper About | Eyebrow + título itálico + párrafo centrado | `heading_width`, `body_width`, `eyebrow`, `heading`, `body` | — |
| `op-bookcase.liquid` | On Paper Bookcase | Marquee infinito de imágenes con pausa en hover y disco de cursor con texto por imagen | `ratio`, `speed`, `strip_label`, `strip_link` | `image` (imagen, label, link) hasta 6 |
| `op-text.liquid` | On Paper Texto | Párrafo centrado con ancho y tema | `content_width`, `align`, `theme`, `body` | — |
| `op-collection-banner.liquid` | On Paper Banner colección | Imagen full-bleed + título + botón (se oculta si no hay link) | `image`, `overlay`, `heading`, `cta_*` | — |
| `op-bestsellers.liquid` | On Paper Best sellers | Eyebrow + título + grid de N productos de una colección | `collection`, `products_count`, `cta_label` | — |
| `op-cta.liquid` | On Paper CTA | Título + párrafo + botón centrados, con tema/color de fondo | `theme`, `bg_color`, `heading`, `body`, `cta_*` | — |
| `op-gallery.liquid` | On Paper Galería | Mosaico de 3 columnas con ratios por imagen + disco "Escríbenos" | `gap`, `disc_label`, `disc_link` | `image` (columna, ratio) |
| `op-faq.liquid` | On Paper FAQ | Eyebrow + título + acordeón | `heading_width`, `list_width`, `eyebrow`, `heading`, `intro` | `item` (pregunta, respuesta) |
| `op-contact.liquid` | On Paper Contacto | `{% form 'contact' %}` nativo + columna lateral (WhatsApp, correo) | labels, `success_text`, `whatsapp_url`, `email` | — |

Todas exponen `padding_top`/`padding_bottom`.

### Secciones de página (una por template; sin preset)

| Archivo | Template | Qué hace |
|---|---|---|
| `product.liquid` | `product*.json` | Galería (principal 1:1 + 4 thumbs), precio de variante, formulario por bloques, barra sticky, relacionados (primera colección o todos), buy now opcional, límite `custom.max_qty` |
| `op-collection.liquid` | `collection.json` | Encabezado centrado + grid (columnas y ratio configurables) + paginación |
| `collections.liquid` | `list-collections.json` | Lista de colecciones en cards |
| `search.liquid` | `search.json` | Pill de búsqueda + meta sobre hairline + grid; estado vacío con CTA |
| `page.liquid` | `page.json`, `page.legal.json` | Título serif + prosa `rte` (h2–h4, listas, tablas); eyebrow opcional; ancho en `ch` |
| `cart.liquid` | `cart.json` | Página completa del carrito con nota y `content_for_additional_checkout_buttons` |
| `blog.liquid`, `article.liquid` | `blog.json`, `article.json` | Lista editorial y artículo con comentarios |
| `404.liquid`, `password.liquid` | `404.json`, `password.json` | Editorial centrado; portada "Muy pronto" a pantalla completa |
| `customers-*.liquid` (7) | `customers/*.json` | Login, registro, cuenta, pedido, direcciones, reset, activar; estilos en `snippets/op-account-styles.liquid` |

### Secciones globales

| Archivo | Dónde | Qué hace |
|---|---|---|
| `op-header.liquid` | `header-group.json` | Barra + mega-menú (Productos ← colección `products_collection` o todos; Colecciones ← `panel_collections` o todas; Best sellers ← `bestsellers_collection`), Otros (link), búsqueda inline (`show_search` + textos), cuenta, carrito, selectores de país/idioma, drawer móvil |
| `op-footer.liquid` | `footer-group.json` | Wordmark, dos menús (`link_list`), políticas automáticas (`show_policies`), contacto, dirección, horario, redes, WhatsApp; tema oscuro con imagen de fondo opcional |
| `op-cart-drawer.liquid` | `theme.liquid` (estática) | Drawer AJAX; sus textos se editan en Configuración del theme → sección Cart drawer |

## 4. Bloques del producto (`product.liquid`)

| Tipo | Uso | Settings | Nota |
|---|---|---|---|
| `heading` | Título + intro | `title` (rich), `intro` | uno por producto |
| `accordion` | Detalles, Tiempo de envío | `heading`, `content` | informativo |
| `pills` | Material (u otra opción de texto) | `label`, `options` (coma), `default`, `collapsible` | property; puede ser opción de variante si el nombre coincide |
| `swatch` | Color / Hotstamping | `label`, `palette` (telas, vinipieles, telas-plastificadas, papel-texturizado, hotstamping), `default`, `depends_on`, `show_for`, `collapsible` | property; nombre viaja al pedido |
| `size` | Tamaño | `label`, `set` (photobook, firmas-bookcase, memory, carpetas, cajas, fotos), `default`, `note` | normalmente opción de variante |
| `dropdown` | Número de fotos, Tipo de hojas… | `label`, `options` | normalmente opción de variante |
| `radio` | Sí/No, Minimalista/Tradicional, entrega | `label`, `options`, `default`, `note` | property |
| `text`, `textarea`, `url` | Títulos, nombres, link de fotos | `label`, `placeholder`, `required`/`note` | property |
| `stepper` | Cantidades numéricas | `label`, `min`, `default`, `note` | property |
| `note` | Aclaración bajo un campo | `text` | solo texto |
| `gift_type` | Legado del certificado (producto vs monto) | … | ya no se usa; el certificado usa `pills` |

Sets de tamaños (`snippets/op-sizes.liquid`): photobook `14x11, 11x14, 10x10, 8.5x11, 11x8.5, 8x8` ·
firmas-bookcase (mismo set, otro orden) · memory `4x5, 5x7` · carpetas `17x11, 11x8.5, 11x17, 8.5x11` ·
cajas `11x17, 8.5x11, 17x11, 11x8.5` · fotos `4x5 … 30x45` (9).

## 5. Snippets

| Archivo | Qué hace |
|---|---|
| `op-swatches.liquid` | Paletas oficiales (`Nombre|#hex|archivo`) → botones con textura `assets/swatch-<paleta>-<slug>.webp`. Rosa/Azul metálico están comentados hasta tener mockups. |
| `op-sizes.liquid` | Sets de tamaños → rectángulos a escala |
| `op-field-group.liquid` | Wrapper colapsable con encabezado + hint |
| `op-product-card-mini.liquid` | Mini card para mega-menú |
| `op-logo.liquid` | Wordmark SVG "onpaper®" en `currentColor` |
| `op-account-styles.liquid` | CSS compartido de cuentas (incluye el padding vertical) |
| `css-variables.liquid`, `meta-tags.liquid` | Skeleton: variables de settings, SEO/OG |

## 6. Assets

| Archivo | Rol |
|---|---|
| `brand.css` | Tokens de marca sobre Lumos + estilos de `/policies/*` |
| `critical.css` | Reset, grid `.shopify-section`/`.full-width`, skip link, offset del header |
| `lumos.css` | Framework RAINVO (no editar) |
| `op-anim.css` | Estados iniciales de reveal, cortina, entrada de página |
| `op-gsap.js`, `op-transition.js`, `op-cursor-follow.js` | Motor de animación, transición, disco |
| `op-header.js` | Header, mega-menú, búsqueda, drawer, scroll |
| `op-product.js` | PDP: pickers, deps, imagen por color, galería, stepper, sticky, total |
| `op-variants.js` | Variante real ← opciones; precio |
| `op-cart.js` | Drawer AJAX |
| `op-pricing.js`, `op-pricing-data.js` | Fallback vacío (no cobrar por properties) |
| `swatch-*.webp` (71) | Texturas de swatches |
| Vendor: `gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `lenis.min.js`, `lenis.css` |

## 7. Templates y páginas

| Template | Sección(es) | Notas |
|---|---|---|
| `index.json` | hero → about → bookcase → text → collection banner → bestsellers → cta → gallery | Home; imágenes desde Files (`shopify://shop_images/*`) |
| `product.json` + 10 `product.<handle>.json` | product | bookcase, cajas-personalizadas, carpetas, fotos-impresas, giftcard, libro-de-firmas, memory-box, photobook-layflat, photobook-tradicional, porta-planos |
| `page.json`, `page.legal.json`, `page.faq.json`, `page.contact.json` | page / op-faq + op-cta / op-contact | asignar en Admin → Pages → Template |
| `collection.json`, `list-collections.json`, `search.json`, `cart.json`, `404.json`, `password.json`, `blog.json`, `article.json`, `customers/*.json` | — | estándar |
| `gift_card.liquid` | — | Recibo de gift card nativa de Shopify (Skeleton) |

## 8. Configuración global

- `config/settings_schema.json`: Skeleton (tipografía, layout, colores, radio de inputs) + grupo
  **Marca On Paper** (favicon, logo). Los colores del kit no dependen de estos settings (brand.css).
- `config/settings_data.json` (autogenerado): valores actuales + settings de la sección estática
  `op-cart-drawer`.
- `locales/es.default.json` (principal) y `locales/en.json` (inglés; lo mantiene el editor de idiomas,
  debe tener las mismas claves). `es.default.schema.json` traduce labels del editor de Skeleton.
- `.theme-check.yml` (`theme-check:recommended`), `.shopifyignore` (docs, _import, README, .github).
