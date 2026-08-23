# On Paper — Migración al store definitivo + checklist de operación

> Runbook para dejar la tienda operando. El theme está completo en este repo;
> todo lo de abajo es configuración de Admin/Shopify o insumos del cliente.
> Actualizado: ago-2026.

## 0. Dónde viven las imágenes ahora

Las carpetas pesadas de `_import/` (raw + paquetes, ~550 MB) se movieron a la
rama **`archivo-imagenes`** para que la conexión GitHub→Shopify no falle por
tamaño del repo. Para usar los paquetes en tu máquina:
`git fetch && git switch archivo-imagenes` (y `git switch main` para volver).

## 1. Conectar el theme al store definitivo (2 min)

El store actual `onpaper-fafjay65.myshopify.com` es un dev store NO transferible.
En el **store definitivo** (`on-paper-t6vfjrak.myshopify.com`):

1. Admin → **Online Store → Themes → Add theme → Connect from GitHub** → repo `rainvodev/onpaper-shopify`, rama `main`.
2. Verificar el preview del theme conectado; **Publish** cuando el resto de esta checklist esté listo.
3. Cuando el store nuevo esté verificado, **desconectar la integración GitHub del store viejo** (Themes → ⋯ del theme conectado) para que `main` no publique en dos tiendas.
4. En Partners, confirmar que el store definitivo sí es **transferible** a la cliente antes de cargarlo todo.

## 2. Idioma, dominio y ajustes base

- [ ] Settings → **Languages**: idioma principal = **Español** (requerido: el theme usa `locales/es.default.json` y `<html lang>` sale de aquí).
- [ ] Settings → **Domains**: conectar `onpaper.mx` (y `www`).
- [ ] Settings → **Store details**: nombre, dirección (Río Orinoco 331 Ote., Del Valle, SPGG), correo remitente `taller@onpaper.mx`.
- [ ] Theme editor → **Marca On Paper**: subir favicon y logo.

## 3. Catálogo

- [ ] **Products → Import** `_import/products-variants.csv` con **"Overwrite any current products that have the same handle"** activado. Crea los 9 productos con 245 variantes:
  - `active` con **precios reales del catálogo**: photobook-tradicional, photobook-layflat, bookcase, memory-box, fotos-impresas.
  - `draft` con **precios dummy**: libro-de-firmas, cajas-personalizadas, carpetas, porta-planos. **No activarlos hasta reemplazar los montos** (ver §7).
- [ ] **Gift card nativa**: Products → Gift cards → crear "Certificado de Regalo" con handle `certificado-de-regalo`, opción **`Valor`** y valores EXACTOS `$500, $1000, $1500, $2000, $3000` (denominaciones por confirmar con Anaissa). Asignarle el theme template **giftcard**. Nota: las gift cards de Shopify **no expiran** — la "vigencia de 6 meses" del catálogo debe resolverse como política/manual (decidir con Anaissa).
- [ ] Verificar que **ningún** producto quede a $10.00 (import viejo).
- [ ] Metafield `custom.max_qty` (entero) si se quiere limitar cantidad por pedido (p. ej. 5 en libros, 20 en cajas — el PDP ya lo respeta).
- [ ] **Media por producto** (galería de 4 fotos por producto): subir las 4 de
  `_import/admin-package/product-media/<handle>/` en orden 01→04 (la 01 queda
  como destacada; el PDP muestra las 4 como thumbnails con la activa marcada).
- [ ] **Files — mockups v2**: subir de un jalón los **264** de
  `_import/files-package/mockups/` (originales sin comprimir, llave
  `mockup-<material>-<tamaño>-<color>.webp`; el nombre usa la convención
  ALTO×ANCHO del taller y el theme traduce solo — NO renombrar). Las texturas de
  swatches YA van dentro del theme (assets/) — nada que subir para eso.
- [ ] **Files/editor — home y menú**: imágenes de `_import/admin-package/`
  (01. Home Page / 02. Menú / 03. View all) asignadas desde el editor del theme
  (Personalizar → cada sección → picker de imagen). Ver README del paquete.

## 4. Colecciones, páginas y menús

- [ ] Colecciones: **`best-sellers`** (alimenta el mega-menú y la sección del home) y **`photobooks`** (banner del home la enlaza; si no existe, el botón se oculta solo).
- [ ] Páginas: **`contacto`** (asignar template **page.contact**), **`others`** (la enlaza el nav), **FAQ** (template page.faq), y las legales que se quieran como página (template page.legal).
- [ ] Menús (`main-menu`, `footer`): el footer usa sus dos link lists; las políticas se enlazan solas (ver §5).

## 5. Legal, pagos, envíos

- [ ] Settings → **Policies**: escribir Privacidad, Devoluciones, Envíos y Términos. El footer las enlaza automáticamente en cuanto tienen contenido.
- [ ] Settings → **Payments**: activar Shopify Payments (MXN) + métodos locales que apliquen.
- [ ] Settings → **Shipping**: tarifas del catálogo — **nacional $300**, **local MTY $100**, y **pickup gratis** (Local pickup: Río Orinoco 331 Ote., Del Valle, SPGG).
- [ ] Settings → **Taxes**: IVA MX según el contador.
- [ ] Settings → **Customer accounts**: habilitarlas (el header ya muestra "Mi cuenta" cuando están activas).
- [ ] Settings → **Notifications**: revisar los correos transaccionales (llegan en el idioma del store).

## 6. Prueba end-to-end (antes de quitar el password)

- [ ] Pedido de prueba por producto activo: el precio del PDP = carrito = checkout.
- [ ] Cambiar Material en un PDP → cambia la paleta de colores; elegir color → cambia la imagen (si ya hay imágenes con alt/asset).
- [ ] Formulario de contacto envía y llega al correo.
- [ ] Búsqueda y cuenta accesibles desde el header; políticas en el footer.
- [ ] Compra de gift card digital: llega el código por correo.
- [ ] Plan de pago activado por Anaissa + transferencia de propiedad a `taller@onpaper.mx`; quitar el password de la tienda.

## 7. Reemplazar los precios dummy (cuando Anaissa los mande)

Los montos dummy viven en un solo lugar: **`_import/gen_variants_csv.py`** (mapas
`FIRMAS_BASE/TAM/TIPO/CANT`, `CAJAS_BASE/TAM`, `CARP_BASE/TAM`, `PORTA_BASE`,
`MAT3`, `HERRAJE`, `PLACA`). Los precios reales de photobooks/bookcase/memory/fotos
están en `BAND_*`/`FOTOS_PRICE`/`MEMORY_*` y ya coinciden con el catálogo.

1. Editar los mapas con los montos reales.
2. `python3 _import/gen_variants_csv.py` → regenera `products-variants.csv` con autovalidación (≤3 opciones, ≤100 variantes, valores == templates).
3. Cambiar `'draft'` → `'active'` en los productos correspondientes dentro del generador y regenerar.
4. Re-importar el CSV en Admin con overwrite. (Ojo: el overwrite pisa ediciones manuales hechas en Admin sobre esos productos.)
5. Commit del CSV + generador a `main` (para que repo y tienda no diverjan).

## 8. Decisiones pendientes del cliente (Anaissa)

- Montos reales de Libro de Firmas (base, tamaños, tipo de hojas, tiers de hojas "Hasta 20/30/40/50"), Cajas, Carpetas y Porta Planos; cargo (o no) del textarea "Agregar más nombres".
- USB (+$150 dummy) y Placa (+$250 dummy) en cajas/carpetas: hoy **no se cobran** (viajan como property en el pedido); decidir si se absorben en base, se cobran (requiere producto add-on) o se cotizan.
- Denominaciones definitivas de la gift card y política de vigencia (Shopify no expira gift cards nativas).
- Nombres oficiales: "Guinda" vs "Guinda Oscuro" (telas); materiales del Libro de Firmas (catálogo dice Tela/Piel/Vinil; el sitio usa Tela/Vinipiel/Impresión).
- Headings del home en inglés ("Crafted with passion…", "Get to know our Photobook Collections.", "About us" ya traducido): ¿se quedan como voz de marca o se traducen?
- Paquete Boda (10/15/20% por 2/3/4+ libros concepto boda + copia 50%): los descuentos escalonados por cantidad **no son nativos** en plan Basic — opciones: códigos de descuento manuales, app de descuentos, o manejarlo por cotización. Post-lanzamiento.

## 9. Post-lanzamiento (no bloquea operar)

- Analytics: GA4 / Meta Pixel vía Customer Events (Admin → Settings → Customer events) — el theme no trae píxeles.
- Captura de email / newsletter (hoy no hay formulario de suscripción).
- Shopify Markets EN + multimoneda: el header ya trae los selectores; requiere extracción de strings a locales + Translate & Adapt (fase aparte).
- Predictive search (hoy la búsqueda es la página estándar).
