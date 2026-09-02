# Elementos de UI — On Paper

Piezas reutilizables del kit con sus clases, dónde vive su CSS y sus estados. Antes de crear un
elemento nuevo, busca aquí: casi siempre existe.

Convención de clases: `.op-<bloque>_<elemento>`, modificador `--x`, estado `.is-x`, hooks de JS `data-op-*`.

## Botones

| Elemento | Clase(s) | Spec | Dónde |
|---|---|---|---|
| Primario relleno | `.op-search_submit`, `.op-cart_checkout`, `.op-header_searchsubmit`, `.op-acct_submit` | Marcellus mayúsculas .74–.8 rem, blanco sobre sage, pill, hover → olive | Buscar, checkout, cuenta |
| Outline (acción principal en tinta) | `.op-product_add`, `.op-search_allcta`, `.op-cart_continue` | borde 1 px tinta, texto tinta, hover invierte (fondo tinta, texto crema) | Agregar al carrito, "Ver todos los productos" |
| Buy now (Shopify) | `.shopify-payment-button__button--unbranded` | mismo estilo que primario | PDP (`show_buy_now`) |
| Link etiqueta | `.op-header_searchall`, `.op-search_pagelink`, `.op-cart_view`, `.op-acct_link` | Marcellus mayúsculas .72–.74 rem, opacidad .7 → 1 | Ver todos, paginación, ver carrito |
| Sticky add | `.op-product_sticky-add` | barra flotante al perder de vista el precio (IntersectionObserver) | PDP |

## Campos

| Elemento | Clase | Spec |
|---|---|---|
| Input texto/url/number, select | `.op-product_field input`, `.op-product_select`, `.op-acct_field input` | pill, borde 16 % (PDP) / 32 % (búsqueda), fondo transparente, padding .85rem 1.2rem, .95 rem |
| Textarea | `.op-product_field textarea` | igual, radio 1rem, resize vertical |
| Label de campo | `.op-product_field-label` | Marcellus mayúsculas .74 rem, opacidad .85 |
| Nota | `.op-product_note`, `.op-product_grp-hint` | itálica, .8 rem, opacidad .6 |
| Búsqueda (pill compuesta) | `.op-header_searchform` / `.op-search_form` (+ `_glass`, `_input`, `_submit`) | lupa + input + botón relleno dentro de una pill con borde 32 % (62 % focus-within) |
| Búsqueda móvil | `.op-header_drawersearch` | pill con lupa como botón |
| Stepper | `.op-product_stepper` (`data-op-stepper`) | pill con −/+, respeta `min`/`max`, aviso `[data-op-qty-msg]` al tope |
| Error inline | `.op-product_add-error`, `.op-cart_error`, `.op-acct_errors` | .82 rem, color error |

## Selectores de personalización (PDP)

Todos son `[data-op-picker]` con un `<input type="hidden" name="properties[<Label>]">` y opciones
`[data-val]`; `op-product.js` marca `.is-active`, escribe el hidden y dispara `change`.

| Elemento | Clase | Spec / estados |
|---|---|---|
| Pills (Material, Producto…) | `.op-product_pills` › `.op-product_pill` | pill borde 16 %; activa = fondo sage, texto blanco |
| Swatches (Color, Hotstamping) | `.op-product_swatches` › `.op-product_swatch` | círculo 2.6 rem con textura `swatch-*.webp`; activa = outline 2 px tinta; el nombre elegido se muestra junto al encabezado del grupo `(Verde militar)` en vivo |
| Tamaños | `.op-product_sizes` › `.op-product_size` (+ `-box`, `-label`) | rectángulo a escala real (4.4 rem lado mayor), activo = relleno sage |
| Radio | `.op-product_radios` › `.op-product_radio` (+ `-dot`) | punto 1.1 rem, activo = centro sage |
| Dropdown | `.op-product_select` | select nativo estilizado como pill |
| Grupo colapsable | `<details class="op-product_grp">` › `.op-product_grp-sum` + `.op-product_grp-hint` + `.op-product_grp-body` | encabezado Marcellus con flecha ↓/↑; hint itálico; snippet `op-field-group` |
| Paleta dependiente | `[data-op-dep][data-op-dep-prop][data-op-dep-values]` | visible solo si el valor del campo controlador está en la lista; inputs de grupos ocultos se deshabilitan |
| Acordeón informativo | `<details class="op-product_acc">` › `.op-product_acc-sum` / `-body` | Detalles, Tiempo de envío; primer párrafo en itálica |

## Cards

| Elemento | Clase | Spec |
|---|---|---|
| Producto (colección, búsqueda, relacionados) | `.op-collection_card`, `.op-search_card`, `.op-product_related-*` | media 4:5 con hover scale 1.04, nombre serif 1.1 rem, precio .9 rem opacidad .75 |
| Mini card (mega-menú, resultados de búsqueda del header) | snippet `op-product-card-mini` → `.op-header_pcard` (+ `_pmedia`, `_pimg`, `_pname`, `_pprice`) | ratio configurable (`feature_ratio`), nombre .95 rem |
| Colección (lista) | `.op-cols_card` | igual que producto, sin precio |
| Artículo de blog | `.op-blog_card` | imagen wide + título serif + fecha |
| Ítem del carrito | `.op-cart_item` (+ `-media`, `-info`, `-title`, `-variant`, `-props`, `-bottom`, `-price`) | grid 4.5 rem + texto; variante y properties en lista pequeña |
| Tarjeta de cuenta | `.op-acct_card` | borde 16 %, radio 1 rem |

## Superficies y navegación

| Elemento | Clase / hook | Spec |
|---|---|---|
| Header fijo | `.op-header[data-op-header]` (`.is-overlay`, `.is-scrolled`, `.is-hidden`, `.is-menu-open`, `.is-drawer-open`) | fondo crema; en home transparente sobre el hero con fondo blanco revelado por máscara al scrollear; se oculta al bajar |
| Mega-panel | `.op-header_panel[data-op-panel]` (`.is-open`) | clip-path desde arriba 500 ms, min-height 50svh, fondo crema; grid lista + 3 mini cards |
| Panel de búsqueda | `.op-header_panel--search` | mismo panel, sin min-height; resultados en grid de 4 mini cards |
| Drawer móvil | `.op-header_drawer[data-op-drawer]` | ≤ 990 px; acordeones `<details class="op-header_acc">`, máscara GSAP + stagger |
| Cart drawer | `.op-cart[data-op-cart]` › `.op-cart_overlay` + `.op-cart_panel` | panel derecho `clamp(20rem, 90vw, 27rem)`, clip-path 480 ms, overlay .35 |
| Disco de cursor | `[data-cursor-follow]` › `[data-cursor-disc]` (`.op-bookcase_disc`, `.op-gallery_disc`) | 8.5 rem, crema translúcida con blur, texto Marcellus; sigue con lerp .18; texto por elemento con `data-disc-label` |
| Marquee | `.op-bookcase_track` | `translateX(-50%)` lineal infinito, pausa en hover |
| Cortina de transición | `.op-transition` | crema, 0.42 s; solo links internos |

## Texto y prosa

| Elemento | Clase | Spec |
|---|---|---|
| Eyebrow | `.op-*_eyebrow`, `.u-eyebrow-text` | Marcellus mayúsculas .72 rem, tracking .14 em, opacidad .55–.7 |
| Título de página | `.op-page_title`, `.op-search_title`, `.op-blog_title`… | serif itálica, sage, `clamp(1.7rem, 1.1rem + 2.2vw, 2.6rem)` |
| Prosa (rich text) | `.op-page_body.rte`, `.op-article_body`, `.shopify-policy__body` | 70ch, .97 rem/1.7, h2–h4 serif 400, listas con marcador sage, blockquote con barra sage, tablas hairline |
| Meta / conteo | `.op-search_meta`, `.op-blog_date` | Marcellus mayúsculas .74 rem sobre hairline |
| Estado vacío | `.op-search_none`, `.op-cart_empty` | texto centrado opacidad .75 + CTA outline |
| Paginación | `.op-search_pager`, `.op-collection_pager` | Anterior · 1 / 3 · Siguiente |

## Accesibilidad incorporada

Skip link (`.skip-link` → `#op-main`), `aria-expanded`/`aria-controls` en triggers, `role="dialog"`
`aria-modal` en el cart drawer, foco devuelto al cerrar paneles, `aria-hidden` en clones del marquee,
`prefers-reduced-motion` en todo el movimiento, `<noscript>` que muestra todo el contenido.
