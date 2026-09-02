# Styleguide — On Paper

Fuente de verdad visual del theme. Los valores salen del diseño en Adobe XD (jun-2026) y viven como
tokens en `assets/brand.css` (marca) sobre `assets/lumos.css` (framework). Si un valor de aquí no
coincide con el código, el código manda y hay que corregir este documento.

## 1. Personalidad

Editorial, artesanal, silenciosa. Mucho aire, tipografía serif con itálicas como acento, paleta de
tintas (olive) sobre cremas. Nada grita: los botones son pills delgadas, los bordes son hairlines, las
animaciones son máscaras y fundidos lentos. El producto (papel, tela, hotstamping) es el color.

## 2. Color

| Token | Valor | Uso |
|---|---|---|
| `--swatch--brand-500` | `#5F604E` (olive) | Tinta: texto, iconos, bordes fuertes, botón outline |
| `--swatch--brand-300` | mezcla 40% blanco ≈ `#B0B094` (sage) | Acento: títulos de página, botón primario relleno, pill activa, marcador de listas |
| `--swatch--light-200` | `#F5F5EF` (crema) | Fondo base del sitio, paneles del menú, cart drawer, cortina de transición |
| `--swatch--light-100` | `#FFFFFF` | Fondo del header al scrollear en el home, drawer móvil, fondo-2 |
| `--swatch--sand-300` | `#E5E1D9` | Arena cálida (CTA "Proyectos personalizados", opcional por setting) |
| Tema oscuro | fondo `#2A2A24` / `#3A3A31`, texto crema, acento sage | Hero sobre imagen, footer (`u-theme-dark`) |
| `--_theme---border` | tinta al 16 % | Hairlines: acordeones, divisores, tablas |
| Borde de campo | `currentColor` al 32 % (62 % con foco) | Inputs y pills de búsqueda (el 16 % no se ve sobre crema) |
| Error | `#A4472F` | Mensajes de error de formulario/carrito |
| Disco del cursor | `rgba(245,245,239,.65)` + blur 6px | Disco que sigue al cursor (galería, bookcase) |

Reglas: el color de acento nunca se usa como fondo de sección grande; el texto siempre es tinta o crema
(no gris puro); los swatches de producto muestran la **textura real** (`assets/swatch-*.webp`) con el
color promedio como fallback.

## 3. Tipografía

Cargadas desde Google Fonts en `layout/theme.liquid` (`Source Serif Pro` 400/600 + itálicas y
`Marcellus`).

| Rol | Fuente | Spec | Ejemplos |
|---|---|---|---|
| Display / títulos | Source Serif Pro 400, **itálica como acento** | Home: escala Lumos h1–h2; páginas: `clamp(1.7rem, 1.1rem + 2.2vw, 2.6rem)`, color sage | "Crafted with passion, *designed for a lifetime.*" |
| Cuerpo / prosa | Source Serif Pro 400 | 0.97 rem / 1.7 en legales; 0.9–0.95 rem en acordeones y notas | Detalles del producto, políticas |
| Labels / navegación / eyebrows | Marcellus, **MAYÚSCULAS**, tracking 0.08–0.14 em | 0.72–0.82 rem | "PRODUCTOS", "MÁS VENDIDOS", "COLOR" |
| Precios y metadatos | Source Serif Pro 400 | 0.9 rem, opacidad .75 | "$ 4,750.00" |

Reglas:
- **Los títulos nunca van en mayúsculas** (`brand.css` lo fuerza sobre las utilidades de Lumos).
- La itálica se escribe con `<em>` dentro del rich text del editor; el theme la respeta.
- Un solo peso para títulos (400). El 600 solo para `<strong>` en prosa.
- Los headings del home están en inglés como voz de marca (decisión pendiente de Anaissa; ver
  `docs/migracion.md` §8). El resto del sitio es español.

## 4. Espaciado y layout

- **Escala Lumos** (fluida entre 375 y 1440 px): `--_spacing---space--1` (.375–.5 rem) · `2` (.625–.75)
  · `3` (.875–1) · `4` (1.25–1.5) · `5` (1.75–2) · `6` (2–2.5) · `7` (2.25–3) · `8` (2.5–4 rem).
  Úsala en gaps, márgenes y paddings internos; nada de píxeles sueltos.
- **Padding de sección**: cada sección expone `padding_top`/`padding_bottom` (px, editor) y lo aplica con
  `clamp(0.42·x px, x/12 vw, x px)` → en desktop vale el número del editor, en móvil ~42 %.
  Defaults habituales: 96/96 (páginas), 96/128 (listas), 64 (home), 160 (404).
- **Contenedor**: `.u-container` (ancho máx `90rem`, margen mínimo 20 px; ambos en Configuración del
  theme → Layout). Secciones full-bleed con la clase `full-width` (header, footer, bookcase, hero).
- **Grids de producto**: 3 columnas desktop, 2 tablet (≤ 990 px), 1 móvil (≤ 600 px); ratio 4:5.
- **Breakpoints del kit**: 990 px (nav → burger, grids a 2), 600 px (grids a 1), 900 px (bookcase).

## 5. Formas y superficies

- Botones y campos: **pill** (`border-radius: 2rem`); textarea `1rem`; cards de tarjeta de cuenta `1rem`.
- Imágenes de producto y cards: **sin radio**, esquinas rectas.
- Swatches: círculo 2.6 rem, sin borde; anillo activo = outline 2 px de tinta a 0.15 rem.
- Sombras: solo en paneles flotantes (menú `0 1.5rem 2rem -1.5rem rgba(0,0,0,.18)`, cart drawer
  `-1rem 0 2.5rem -1rem rgba(0,0,0,.25)`). Nunca en cards.
- Divisores: hairline 1 px (`--_theme---border`).

## 6. Movimiento

Motor: GSAP + ScrollTrigger + SplitText (`assets/op-gsap.js`), Lenis smooth scroll (`lerp .1`), CSS en
`assets/op-anim.css`. Todo respeta `prefers-reduced-motion` y nada queda oculto sin JS.

| Patrón | Spec | Dónde |
|---|---|---|
| Reveal al entrar al viewport | fade + 24 px, 0.85 s `power3.out`; variantes `fade/up/down/left/right/zoom`; stagger automático en `[data-reveal-group]` | Casi todo |
| Título palabra por palabra | SplitText, 1.0 s `power4.out` | Headings del home |
| Máscara (clip-path) | 480–550 ms `cubic-bezier(.16,1,.3,1)` | Paneles del menú, cart drawer, fondo del header, imagen del PDP |
| Hover en imagen | `scale(1.03–1.04)` 600–700 ms ease | Cards, bookcase, mini cards |
| Transición de página | cortina crema 0.42 s `power2.inOut` + fundido de entrada 0.5 s | Todos los links internos |
| Marquee | 35 s lineal (15–60 configurable), pausa en hover | Bookcase |
| Header | oculta al bajar (después de 90 px), muestra al subir; fondo blanco por máscara al scrollear en home | Global |
| Micro | opacidad/color 200–300 ms | Botones, links, pills |

Reglas: una sola curva "editorial" (`.16,1,.3,1`) para máscaras; nada rebota; nada dura menos de 200 ms
ni más de 1 s salvo marquee/parallax.

## 7. Imágenes

- Formato WebP; `image_url` con `widths` y `sizes` responsivos, `loading="lazy"` fuera del fold.
- Ratios: 4:5 cards y mini cards (configurable en header), 1:1 imagen principal del PDP, 4:5 media del
  carrito, home según sección (bookcase 5:4 default; galería wide/square/tall/pano).
- Mockups por color: originales del taller sin recomprimir en Files
  (`mockup-<material>-<tamaño>-<color>.webp`); el CDN redimensiona con `?width=`.
- Fotos de producto: 4 por producto (la primera es la destacada).

## 8. Iconografía

SVG inline, `stroke="currentColor"`, `stroke-width="1.5"`, 17–20 px, sin relleno (lupa, cuenta,
carrito, chevrons, flechas ↓/↑ en acordeones). Sin librerías de iconos.

## 9. Voz y copy

- **Español de México, tuteo, cálido y breve.** "Escríbenos", "Trabajemos juntos", "Tu carrito está vacío."
- Labels del editor y del formulario en español con mayúscula inicial ("Número de fotos").
- Los nombres de producto y de color se escriben como los usa el taller.
- Precios en MXN con formato de la tienda (`$ 4,750.00`).
- Notas al pie en itálica y opacidad .6 para aclaraciones ("*Medidas en pulgadas*").
