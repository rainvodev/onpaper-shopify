# Handoff — On Paper (diagnóstico y plan de entrega)

> Fecha: 2 de septiembre de 2026. Autor: RAINVO (Gabriel) con Claude.
> Destinatarios: Anaissa (On Paper) y el Claude que la acompañe.
> Estado del theme al cierre: **theme check 0 errores, CI verde, tienda operable.**

## 0. Resumen ejecutivo

- El theme está completo y publicado en `on-paper-t6vfjrak.myshopify.com` vía integración GitHub
  (`main` = producción). Anaissa ya edita contenido desde el Admin y esos cambios llegan al repo como
  commits de `shopify[bot]`; la sincronización bidireccional funciona.
- Hoy se encontró y corrigió un problema real: el CI estaba en rojo desde el 1 de septiembre porque
  al activar el idioma inglés Shopify creó `locales/en.json` sin dos claves del theme. Ya está completo.
- Quedan **4 riesgos P0** antes de quitar el password (precios dummy activos, certificado sin variantes
  verificadas, inglés activado sin traducciones de contenido, dependencia de la cuenta GitHub de RAINVO
  para el deploy). Están en §1.3 con su acción.
- Recomendación: Anaissa opera con **Admin + editor** para contenido y con **su Claude sobre este repo**
  para código, siguiendo `CLAUDE.md` y `docs/reglas.md`. RAINVO queda como soporte acotado (§2, fase D).

## 1. Diagnóstico

### 1.1 Qué cambió Anaissa (commits `shopify[bot]`, 27 ago → 2 sep)

Revisado commit por commit en el repo. Todo es coherente y bien hecho; nada rompió el theme.

| Área | Cambio | Evaluación |
|---|---|---|
| Header (`op-header.liquid`, código) | Nuevo setting **"Colecciones del panel"** (`panel_collections`, hasta 6) para elegir qué colecciones salen en el mega-menú; selector de país muestra nombre + moneda; "Carrito" ahora sale del locale (`cart.title`) | Correcto. Un `{%- endfor -%}` quedó pegado en la misma línea del `<option>` (cosmético, theme check no lo marca). |
| Header (settings) | Etiqueta "Otros" → **"Faq"** → `/pages/faq`; productos del panel ← colección `all-products`; best sellers ← `frontpage`; etiquetas en español | Correcto. Ver que `all-products` contenga los 10 productos (o vaciar el setting: "vacío = todos"). |
| Certificado de regalo (`product.giftcard.json`, 9 commits) | Rediseñado como **producto normal**: pills "Producto" con 10 opciones (paquetes de fotos, memory box, photobooks por tier), notas de vigencia 6 meses, entrega digital/física, datos de quien regala y recibe, sin cantidad | Decisión válida (reemplaza la gift card nativa del runbook). **Requiere** que el producto en Admin tenga la opción de variante `Producto` con esos 10 valores y sus precios; si no, cobra un precio único (§1.3). |
| Footer (settings) | Teléfono (81) 3563 9959, dirección y mapa, horario, Instagram/TikTok/Pinterest/Facebook, WhatsApp; **políticas del footer desactivadas** (`show_policies: false`); menús: `menu_1 = footer`, `menu_2 = main-menu` | Correcto. Confirmar que las legales se enlazan desde alguno de los dos menús (§1.3). |
| Configuración del theme | Favicon subido; textos del cart drawer guardados en español | Correcto. |
| Home (`index.json`) | 20 imágenes asignadas desde Files; textos; bookcase con imágenes | Correcto. Headings display siguen en inglés (decisión pendiente, §1.4). |
| Idiomas | Inglés agregado en Settings → Languages: Shopify creó `locales/en.json` (667 líneas: traducciones automáticas del theme + strings de sistema `shopify.*`) y añadió el encabezado *auto-generated* a `es.default.json` | Generó el CI rojo (faltaban `404.title` y `blog.article_metadata_html`). **Corregido hoy**; también se corrigió la traducción automática "Very soon" → "Coming soon". Revisar el resto de traducciones automáticas antes de publicar EN. |
| Productos | Los 4 productos con precios dummy fueron puestos en **Active** (reportado en sesión) | **Riesgo P0** mientras la tienda tenga clientes reales (§1.3). |

Sobre "se conectó con Claude": las ediciones de código de Anaissa entran por el Admin (editor de código /
asistente) y se ven en el repo como `shopify[bot]`. Son competentes, pero ese canal **no corre theme
check ni el CI antes de publicar**: por eso el repo estuvo en rojo un día sin que nadie lo viera. La
solución no es prohibir el canal sino darle a su Claude las reglas del repo (`CLAUDE.md`) y hacer que
los cambios de código pasen por el flujo con checks (§3).

### 1.2 Estado técnico verificado hoy (en el repo; el storefront no es visible desde esta sesión)

- `theme check`: 82 archivos, 0 errores, 9 warnings `RemoteAsset` (fuentes de Google, aceptados).
- Todas las páginas con padding vertical fluido uniforme; políticas nativas `/policies/*` estilizadas;
  búsqueda inline con resultados en vivo; página de búsqueda rediseñada.
- PDP: variantes nativas (precio = cobro), paletas dependientes del material, mockups por
  material+tamaño+color (264 en Files), nombre del color en vivo, vuelta a la foto original con
  Impresión, galería de 4 fotos, barra sticky, límite de cantidad por metafield.
- Carrito: drawer AJAX con máscara en todos los caminos de apertura; página `/cart` con pagos express.
- Home: hero, about, bookcase marquee con disco inteligente, banner, best sellers, CTA, galería.
- Repo liviano (~2 MB) y CI en cada push; imágenes históricas en `archivo-imagenes`.

### 1.3 Riesgos y pendientes por prioridad

**P0 — antes de quitar el password / recibir pedidos reales**

1. **Precios dummy activos.** Libro de Firmas, Cajas Personalizadas, Carpetas y Porta Planos cobran montos
   inventados (p. ej. Libro de Firmas base $1,490 + modificadores). Acción: Anaissa manda los montos →
   receta "Cambiar precios" en `docs/usos.md` (generador → CSV → import con overwrite). Mientras tanto,
   regresarlos a **Draft** o dejar el password.
2. **Certificado de regalo.** Verificar en Admin → Products → Certificado de Regalo que exista la opción
   `Producto` con los 10 valores exactos del bloque y su precio cada uno. Sin eso el certificado cobra un
   único precio. (El bloque está en `templates/product.giftcard.json`.)
3. **Inglés.** El idioma existe pero productos, secciones y páginas no están traducidos: un visitante en EN
   vería el chrome en inglés y el contenido en español. Acción: mantener EN **sin publicar** hasta
   traducir con Translate & Adapt, y revisar las traducciones automáticas de `locales/en.json`.
4. **Dependencia del GitHub de RAINVO.** La conexión Shopify ↔ GitHub la hizo la cuenta de Gabriel. Si esa
   cuenta pierde acceso a la tienda o al repo, el deploy deja de sincronizar. Acción en §2 (fase B).

**P1 — lanzamiento**

5. Plan de pago y **transferencia** de la tienda a `taller@onpaper.mx` (Partners); dominio `onpaper.mx`;
   quitar password; **desconectar** la integración GitHub del dev store viejo `onpaper-fafjay65`.
6. Legales: `show_policies` está apagado en el footer. Decidir: (a) Settings → Policies + encender el
   toggle, o (b) páginas con template `legal` enlazadas desde el menú 2 del footer. Ambas se ven igual.
7. Envíos (nacional $300, local MTY $100, pickup gratis), pagos (Shopify Payments MXN), impuestos,
   cuentas de cliente, correos transaccionales: `docs/migracion.md` §5.
8. Pedido de prueba end-to-end por producto: PDP = carrito = checkout; formulario de contacto; búsqueda.

**P2 — después de lanzar**

9. Decisiones de Anaissa documentadas en `docs/migracion.md` §8 (headings del home en inglés, "Guinda",
   USB/Placa, Paquete Boda, tiers de Memory Box).
10. Mockups de Rosa metálico y Azul metálico (12 archivos) → receta en `docs/usos.md`.
11. Analytics (GA4/Meta por Customer Events), newsletter, Markets EN completo.
12. Limpieza: borrar las ramas `claude/*` en GitHub (solo importan `main` y `archivo-imagenes`).

### 1.4 Decisiones de diseño aparcadas (con Anaissa)

Cortina de transición de 420 ms y peso de GSAP/Lenis (se pueden apagar en `theme.liquid` si prefiere un
sitio más liviano), headings del home en inglés como voz de marca, disco del cursor en móvil (no aplica).

## 2. Plan de handoff

**Fase A — Cierre RAINVO (esta semana).** Hecho: documentación (`CLAUDE.md` + `docs/*`), CI verde,
runbook actualizado. Pendiente: sesión de 45 min con Anaissa: (1) Admin: productos, variantes y CSV;
(2) editor: secciones, bloques del PDP, header/footer; (3) cómo pedirle cosas a Claude y qué no pedirle;
(4) entrega de accesos (§4).

**Fase B — Su Claude (1 día).** Opción recomendada: **Claude Code** (claude.ai/code o app) conectado al
repo de GitHub. Pasos: transferir el repo `rainvodev/onpaper-shopify` a una cuenta/organización de On Paper
(o agregar a Anaissa como colaboradora con permisos de administración); en el Admin, **reconectar el theme
desde GitHub con su cuenta** (Themes → Add theme → Connect from GitHub → `main`) y retirar la conexión
anterior; en Claude Code, abrir el repo: `CLAUDE.md` se lee solo y orienta la sesión. Si Anaissa sigue
usando Claude desde el Admin/editor de código para retoques, está bien para contenido y ajustes
pequeños; para cambios de código, mejor por el repo con checks (§3).

**Fase C — Lanzamiento (Anaissa + RAINVO).** Resolver P0 (§1.3) → checklist `docs/migracion.md`
§2–§6 → transferencia, dominio, quitar password → desconectar dev store.

**Fase D — Soporte.** RAINVO: 30 días de soporte por bugs del theme (no cambios nuevos). Después,
Anaissa + su Claude con las reglas del repo; RAINVO por cotización.

## 3. Cómo trabajar con Claude (para Anaissa)

- **Contenido** (textos, fotos, orden de secciones, precios de una variante puntual): editor de Shopify y
  Admin. No hace falta Claude.
- **Código** (una sección nueva, un bloque nuevo, un color, una animación, un bug): pídeselo a Claude
  **en el repo**. Si no usas Claude Code, pega el contenido de `CLAUDE.md` como primer mensaje.
- **Precios** de varios productos o los dummy: pídele "cambia los precios de X según esta tabla" y él
  regenera el CSV; tú importas con overwrite. Nunca dejes que ponga precios "en el JS".
- **Primer mensaje sugerido para una sesión nueva:**
  "Lee CLAUDE.md y docs/handoff.md. Luego haz `git pull --no-rebase origin main` y dime en tres líneas
  el estado del repo (último commit, theme check). Después te doy la tarea."
- **Cómo reportar un bug:** URL exacta, qué hiciste, qué esperabas, captura. Con eso Claude lo localiza.
- **Qué no pedirle:** desactivar theme check, forzar push, subir imágenes pesadas al repo, instalar apps
  de diseño, renombrar colores u opciones de variantes "para que se vean mejor".

## 4. Accesos e inventario

| Recurso | Dónde | Notas |
|---|---|---|
| Tienda | `on-paper-t6vfjrak.myshopify.com` (Admin) | Transferir a `taller@onpaper.mx` vía Partners; luego RAINVO como staff/colaborador |
| Dev store viejo | `onpaper-fafjay65.myshopify.com` | Desconectar GitHub y abandonar |
| Repo | `github.com/rainvodev/onpaper-shopify` (`main` producción, `archivo-imagenes` backup de imágenes) | Transferir o dar acceso admin a On Paper |
| CI | GitHub Actions (theme check) | Debe estar verde antes de mergear/pushear |
| Dominio | `onpaper.mx` | Conectar en Settings → Domains |
| Imágenes fuente | Drive "On Paper (WebP)" del taller + rama `archivo-imagenes` (`_import/files-package`, `admin-package`) | 264 mockups ya en Files; 71 swatches en `assets/` |
| Catálogo de precios | `CATALOGO.pdf`, `CATALOGO_CAJAS.pdf` (Anaissa) + `_import/gen_variants_csv.py` | Los dummy están marcados en el generador |
| Fuentes | Google Fonts (Source Serif Pro, Marcellus) | Sin cuenta |

## 5. Referencias rápidas

```bash
git pull --no-rebase origin main                      # siempre antes de trabajar
npx -y @shopify/cli@latest theme check                # 0 errores = OK
python3 _import/gen_variants_csv.py                   # regenera el CSV de precios
git push origin main                                  # deploy
```

Documentos: `CLAUDE.md` (entrada) · `docs/reglas.md` · `docs/styleguide.md` · `docs/componentes.md` ·
`docs/elementos.md` · `docs/usos.md` · `docs/migracion.md` (runbook Admin) · `docs/imagenes-spec.md`.
