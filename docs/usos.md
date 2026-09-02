# Usos — recetas paso a paso

Cada receta dice quién la hace (Anaissa en el Admin / Claude en el repo), los pasos y cómo verificar.
Regla general: **contenido en el editor, código en el repo, precios por CSV.**

## Contenido del sitio

### Cambiar textos o imágenes del home
Admin → Online Store → Themes → **Personalizar** → clic en la sección → editar. Los headings aceptan
rich text: usa *cursiva* para el acento. Las imágenes se eligen del picker (van a Files). Guardar → se
publica al instante y llega al repo como commit de `shopify[bot]`.

### Agregar, quitar u ordenar secciones del home
Personalizar → "Agregar sección" → elige del kit (On Paper Hero, About, Bookcase, Texto, Banner colección,
Best sellers, CTA, Galería, FAQ, Contacto). Arrastra para reordenar. Cada sección tiene "Espacio
arriba/abajo".

### Crear una página (legal, FAQ, contacto, "otros")
1. Admin → Online Store → Pages → Add page → escribe el contenido con el editor (usa encabezados H2/H3 y
   listas: el theme los formatea).
2. En **Theme template** elige: `legal` (prosa centrada), `faq` (acordeón editable en Personalizar),
   `contact` (formulario), o `Default page`.
3. Para que aparezca en el menú: Navigation → menú correspondiente. Para el link "Otros/FAQ" del header:
   Personalizar → Header → Others.

### Políticas (privacidad, envíos, devoluciones, términos)
Settings → Policies. Se publican en `/policies/*` con el estilo del theme (brand.css) y el footer las enlaza
solo si "Mostrar políticas" está activo (Personalizar → Footer). Alternativa: páginas con template `legal`.

### Header: qué muestra el mega-menú
Personalizar → Header: "Colección que lista los productos" (vacío = todos los productos publicados),
"Best sellers" (3 productos a la derecha), "Colecciones del panel" (vacío = todas), etiqueta/link de
"Otros", búsqueda (mostrar/ocultar, placeholder, textos). Un producto solo aparece si está **Active** y
disponible en el canal **Online Store**.

### Footer, WhatsApp, redes, horario
Personalizar → Footer. Los dos menús son link lists de Navigation.

### Textos del carrito
Personalizar → Configuración del theme → sección **Cart drawer** (drawer) y Personalizar → página Cart
(página completa).

## Productos

### Editar la personalización de un producto (bloques)
Admin → Products → producto → Theme template (`bookcase`, `libro-de-firmas`, …). En Personalizar, abre
ese producto: los bloques (Material, Tamaño, Color, Hotstamping, textos, notas) se editan, ordenan,
agregan o quitan ahí. **Ojo:** si el bloque corresponde a una opción de variante (Tamaño, Número de fotos,
Tipo de hojas, Cantidad de hojas, Medidas de herraje, Material en cajas/carpetas), su label y sus valores
deben ser idénticos a los de la variante.

### Agregar un producto nuevo (con precio por opciones)
Claude, en el repo:
1. Agrega el producto al generador `_import/gen_variants_csv.py` (opciones, precios, `status`).
2. `python3 _import/gen_variants_csv.py` → regenera `_import/products-variants.csv` (valida ≤ 3 opciones,
   ≤ 100 variantes, valores == templates).
3. Crea `templates/product.<handle>.json` copiando el más parecido; labels de bloques = nombres de opción.
4. Commit + push. Anaissa: Products → Import del CSV con "Overwrite products with matching handles",
   asigna el template al producto, sube 4 fotos (la primera es la destacada), verifica precio en PDP =
   carrito = checkout.

### Cambiar precios (incluye reemplazar los dummy)
1. Editar los mapas en `_import/gen_variants_csv.py` (`BAND_TRAD`, `BAND_LAY`, `BAND_BOOKCASE`,
   `FOTOS_PRICE`, `MEMORY_*` reales; `FIRMAS_*`, `CAJAS_*`, `CARP_*`, `PORTA_BASE`, `MAT3`, `HERRAJE`,
   `PLACA` dummy) y, si aplica, `'draft'` → `'active'`.
2. Regenerar el CSV, commit + push.
3. Admin → Products → Import con overwrite. (Pisa ediciones manuales de esos productos en Admin.)
4. Probar un pedido: precio PDP = carrito = checkout.
Alternativa rápida para un solo precio: editarlo en Admin → Products → variante. Después replicarlo en el
generador para que repo y tienda no diverjan.

### Límite de cantidad por pedido
Metafield de producto `custom.max_qty` (entero). El PDP lo respeta y muestra aviso al tope.

### Certificado de regalo
Es un producto normal (`certificado-de-regalo`, template `giftcard`) con el bloque pills "Producto". Para
que cobre según lo elegido, el producto debe tener una opción de variante llamada exactamente **Producto**
con los mismos valores del bloque y su precio; si no, cobra un precio único. Se entrega manualmente
(WhatsApp/oficina). Las gift cards nativas de Shopify (que no expiran) quedaron descartadas por decisión
de Anaissa.

## Colores e imágenes

### Agregar un color a una paleta
1. Textura del círculo: `assets/swatch-<paleta>-<slug>.webp` (240×240, cover). Slug = minúsculas, sin
   acentos, espacios → `-`.
2. `snippets/op-swatches.liquid`: añadir `Nombre|#hex|<paleta>-<slug>` al string de la paleta (hex = color
   promedio de la textura).
3. Mockups en Admin → Content → Files: `mockup-<material>-<tamaño>-<slug>.webp` por cada tamaño, con el
   tamaño en convención del taller (ALTO×ANCHO: `14x11, 11x14, 10x10, 8x8, 11x8-5, 8-5x11`). Sin
   comprimir (originales). Sin mockup, el color funciona igual pero la imagen no cambia.
4. theme check + push. Verificar en el PDP: swatch visible, nombre en el encabezado, imagen cambia.

### Restaurar Rosa metálico y Azul metálico (vinipiel)
Cuando lleguen sus 12 mockups: subirlos a Files con la convención de arriba y descomentar las dos entradas
al final de la paleta `vinipieles` en `snippets/op-swatches.liquid` (las texturas ya existen en assets).

### Cambiar las fotos de un producto
Admin → Products → producto → Media: 4 imágenes, la primera es la destacada (se ve en cards, menú y al
elegir Impresión). Sin mover código.

### Cambiar imágenes del home
Personalizar → sección → picker (Files). Tamaños recomendados: hero 2400 px de ancho; bookcase/galería
900–1200 px; banner 2400 px.

## Idiomas y textos del sistema

### Inglés (Markets)
Settings → Languages → agregar inglés (Shopify crea/mantiene `locales/en.json`). Traducir contenido con
**Translate & Adapt**. Los strings del theme viven en `locales/es.default.json` y sus equivalentes en
`locales/en.json`: si Claude agrega una clave en español, debe agregarla también en inglés (theme check lo
exige). No publicar el idioma hasta tener traducido productos y secciones.

### Cambiar un texto fijo del theme
Busca primero en Personalizar (casi todo es setting). Si es una clave de locale
(`{{ 'search.title' | t }}`), edítala en Settings → Languages → editor de idiomas o en el JSON (ambos
idiomas).

## Código

### Flujo con Claude Code
1. `git pull --no-rebase origin main`.
2. Cambio. Convenciones en `CLAUDE.md`; reglas en `docs/reglas.md`.
3. `npx -y @shopify/cli@latest theme check` (0 errores) · `node --check` de los JS tocados · JSON válido.
4. Commit descriptivo → `git push origin main` (deploy automático). Si el push es rechazado, pull de nuevo
   (merge, nunca rebase) y push.
5. Verificar en la tienda (o pedir captura).

### Probar sin publicar
`shopify theme push --unpublished` sube una copia; revisar con el link de preview; no conectar esa copia a
GitHub.

### Agregar una sección nueva al kit
Copia la más parecida de `sections/op-*.liquid`; conserva: comentario de cabecera, `padding_top/bottom`
con el `clamp()` del kit, `{% stylesheet %}` con prefijo `.op-<nombre>_`, schema con `presets`, textos como
settings con default en español, `data-reveal` en los elementos que entran.

### Debug del header
Añade `?opdebug=1` a la URL: `op-header.js` loguea aperturas/cierres y marca los elementos animados.
