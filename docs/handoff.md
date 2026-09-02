# Handoff — On Paper (diagnóstico y plan de entrega)

> Fecha: 2 de septiembre de 2026, actualizado tras la llamada RAINVO x On Paper de las 10:28
> (notas y transcripción en Drive: "RAINVO x On Paper: 2026/09/02 10:28 CST"). Autor: RAINVO (Gabriel) con Claude.
> Destinatarios: Anaissa (On Paper) y el Claude que la acompañe.
> Estado del theme al cierre: **theme check 0 errores, CI verde, tienda operable.**

## 0. Resumen ejecutivo

**Lo que cambió con la llamada del 2-sep.** Anaissa ya conectó `onpaper.mx` (sigue con password), cargó
las legales (plantilla de RAINVO + su información), activó y revisó el inglés con su Claude, ajustó
precios e imágenes, y rediseñó el certificado como producto con precio por opción. Se acordó: monedas
solo MXN/USD/EUR; Shopify Payments (sin Mercado Pago/Stripe); checkout estándar personalizando logo y
colores (sin upgrade de plan); ella hace la compra de prueba y lanza la tienda por su cuenta; RAINVO da
30 días de soporte (2-sep → 2-oct) con respaldos semanales y reporte al cierre, y ofrece servicio mensual
después. El cierre financiero se acordó en la llamada (detalle en RAINVO OS, no aquí). Documentación
enviada el mismo día (este repo + página HTML para Anaissa).


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
| Productos | Los 4 productos con precios dummy fueron puestos en **Active**; en la llamada dijo haber ajustado precios en el Admin | Sincronizar el generador desde el Admin antes de cualquier import (§1.3). |
| Dominio | `onpaper.mx` conectado por ella; tienda con password | Correcto. |
| Legales | Términos, envíos/devoluciones y privacidad cargados (plantilla del abogado de RAINVO + su info vía su Claude) | Recomendado revisar con abogado; plantillas originales en Drive de RAINVO. |
| Idiomas | Inglés publicado; su Claude corrigió traducciones forzadas | Falta revisión fina; `en.json` completado hoy. |

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

1. **Precios: el Admin puede ir por delante del repo.** Anaissa editó precios en el Admin. Antes de
   cualquier import con overwrite hay que sincronizar `_import/gen_variants_csv.py` desde una exportación
   de productos (receta en `docs/usos.md`); si quedan montos dummy en Firmas/Cajas/Carpetas/Porta Planos,
   a Draft o montos reales.
2. **Monedas (Markets).** Se activaron todos los países de Europa. Acordado: México (MXN), Estados Unidos
   (USD) y un mercado Europa (EUR). Acción de Anaissa en Settings → Markets (o su Claude).
3. **Compra de prueba sin cobro.** Shopify Payments en modo de prueba (tarjeta 4242…), 2–3 pedidos con
   personalización completa y el certificado; revisar correo y pedido; apagar el modo de prueba.
4. **Checkout con marca.** Settings → Checkout → Customize: logo, colores, tipografía (sin upgrade). El
   botón "Comprar con Shop" (morado) no se puede recolorear: si molesta, apagar `show_buy_now` en el
   template de producto desde Personalizar.
5. **Legales con abogado.** Lo cargado parte de la plantilla general; recomendación explícita en la
   llamada. Confirmar que se enlacen desde el footer (`show_policies` o menú 2).
6. **Dependencia del GitHub de RAINVO.** La conexión Shopify ↔ GitHub la hizo la cuenta de Gabriel. Acción
   en §2 (fase B).

**P1 — lanzamiento**

5. Plan y tarjeta (en trámite con su banco); quitar password cuando ella decida; **desconectar** la
   integración GitHub del dev store viejo `onpaper-fafjay65`. Dominio: hecho.
6. Legales: `show_policies` está apagado en el footer. Decidir: (a) Settings → Policies + encender el
   toggle, o (b) páginas con template `legal` enlazadas desde el menú 2 del footer. Ambas se ven igual.
7. Envíos (nacional $300, local MTY $100, pickup gratis), impuestos, cuentas de cliente, correos
   transaccionales: `docs/migracion.md` §5. Pagos: Shopify Payments, decidido.
8. Prender/apagar materiales: en photobooks/firmas/bookcase/memory es contenido (pills + `show_for`);
   en cajas/carpetas/porta planos es opción de variante (generador + CSV). Receta en `docs/usos.md`.
9. Pedido de prueba end-to-end por producto: PDP = carrito = checkout; formulario de contacto; búsqueda.

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

**Fase A — Cierre RAINVO (2-sep).** Hecho: llamada de cierre con Anaissa, documentación (`CLAUDE.md` +
`docs/*`), página HTML de entrega, CI verde, runbook actualizado. Pendiente de Gabriel: compartir las dos
plantillas legales de Drive con `taller@onpaper.mx` y avisar a Marijose del cierre e inicio del soporte.

**Fase B — Su Claude (1 día).** Opción recomendada: **Claude Code** (claude.ai/code o app) conectado al
repo de GitHub. Pasos: **transferir** el repo `rainvodev/onpaper-shopify` a una organización de GitHub de
On Paper (recomendado sobre "compartir": el deploy y el acceso de su Claude dejan de depender de RAINVO;
RAINVO queda como colaborador externo durante el soporte); en el Admin, **reconectar el theme
desde GitHub con su cuenta** (Themes → Add theme → Connect from GitHub → `main`) y retirar la conexión
anterior; en Claude Code, abrir el repo: `CLAUDE.md` se lee solo y orienta la sesión. Si Anaissa sigue
usando Claude desde el Admin/editor de código para retoques, está bien para contenido y ajustes
pequeños; para cambios de código, mejor por el repo con checks (§3).

**Fase C — Lanzamiento (Anaissa).** Resolver P0 (§1.3) → compra de prueba → quitar password cuando ella
decida; avisa el día para respaldo antes/después. RAINVO desconecta el dev store viejo.

**Fase D — Soporte (2-sep → 2-oct-2026).** RAINVO: soporte por bugs del theme (no cambios nuevos),
**respaldo semanal** (tag `respaldo/AAAA-MM-DD` en `main` + copia del theme en Admin) y **reporte al
cierre** con las modificaciones registradas. Después: Anaissa + su Claude con las reglas del repo, o el
servicio mensual de RAINVO (respaldos, reporte, soporte y seguridad) si lo contrata.

## 3. Cómo trabajar con Claude (para Anaissa)

- **Regla de oro para su Claude: todo se le muestra en HTML, en su misma ventana.** Cada diagnóstico,
  propuesta, cambio o decisión llega como una página renderizada (Artifacts) con resumen llano,
  antes/después, pasos exactos del Admin y opciones; los detalles técnicos van plegados al final.
  Plantilla: `docs/plantillas/reporte-anaissa.html`. Está como regla obligatoria en `CLAUDE.md`.
- **Contenido** (textos, fotos, orden de secciones, precios de una variante puntual): editor de Shopify y
  Admin. No hace falta Claude.
- **Código** (una sección nueva, un bloque nuevo, un color, una animación, un bug): pídeselo a Claude
  **en el repo**. Si no usas Claude Code, pega el contenido de `CLAUDE.md` como primer mensaje.
- **Precios** de varios productos o los dummy: pídele "cambia los precios de X según esta tabla" y él
  regenera el CSV; tú importas con overwrite. Nunca dejes que ponga precios "en el JS".
- **Primer mensaje sugerido para una sesión nueva:**
  "Lee CLAUDE.md y docs/handoff.md. Luego haz `git pull --no-rebase origin main` y muéstrame en una
  página HTML (con la plantilla de docs/plantillas) el estado de la tienda en lenguaje sencillo.
  Después te doy la tarea."
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
| Catálogo de precios | `CATALOGO.pdf`, `CATALOGO_CAJAS.pdf` (Anaissa) + `_import/gen_variants_csv.py` | Los dummy están marcados en el generador; el Admin puede ir por delante |
| Plantillas legales | Drive RAINVO: "TÉRMINOS Y CONDICIONES DE - [Nombre de la Empresa].docx", "POLÍTICA DE PRIVACIDAD - [Nombre de la Empresa].docx" | Compartir con Anaissa; revisar con abogado |
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
