# On Paper — Spec del pipeline de imágenes (Drive → theme + Files)

> Especificación EJECUTABLE para procesar las 1,065 imágenes de la carpeta de Drive
> "On Paper (WebP)" (manifest completo: `_import/drive_manifest.json`, rutas + file ids).
> Decisiones ya aprobadas por el usuario: **los nombres del Drive son la paleta oficial**
> de la tienda; los mockups viven en **Shopify Files** (paquete listo para drag & drop);
> los círculos de swatch viven en el **repo (assets/)**.

## 0. Descarga

Cada entrada `type:"file"` del manifest se descarga con:
`https://drive.google.com/uc?id=<id>&export=download` (la carpeta está compartida como
"cualquiera con el enlace"; archivos < 3 MB, sin interstitial de confirmación).
Verificar: tamaño descargado == `size` del manifest; reintentar 3× con backoff.
Solo se necesitan estos subconjuntos (≈684 archivos):

| Subconjunto | Ruta en manifest (prefijo tras "On Paper (WebP)/") | Destino |
|---|---|---|
| Mockups | `0[4-7]. */0[23]. Color */02. Mockups/<orient>/<NN. Color>.webp` | `_import/files-package/mockups/` |
| Círculos (UNA copia por paleta) | Tela+Vinipiel del producto `04.`; Plastificada+Papel del `10.`; Hotstamping del `04.` (carpetas `01. Circulos` / `04|05. Hotstamping`) | `assets/` |
| Fotos principales | `NN. <Producto>/01. Fotos principales/*.webp` (10 productos) | `_import/admin-package/product-media/<handle>/` |
| Home / Menú / View all | `01. Home Page/**`, `02. Menú/**`, `03. On paper shop (View all)/*` | `_import/admin-package/` (subcarpetas homónimas) |

NO descargar los "You may also like" (duplicados; la sección related ya es automática).

## 1. Slugs y mapeos canónicos

`slug(nombre)`: quitar prefijo numérico `NN. `, NFD → quitar diacríticos, minúsculas,
`[^a-z0-9]+` → `-`, trim de `-`. Ej.: `17. Verde militar` → `verde-militar`;
`11. Papel Blanco Textura Plastificado .webp` → `papel-blanco-textura-plastificado`
(ojo: hay un espacio antes de `.webp` en ese archivo).

Handles por carpeta de producto:
`04→photobook-tradicional, 05→photobook-layflat, 06→libro-de-firmas, 07→bookcase,
08→memory-box, 09→fotos-impresas, 10→cajas-personalizadas, 11→porta-planos,
12→carpetas, 13→certificado-de-regalo`.

Material por carpeta: `02. Color Tela→tela`, `03. Color Vinipiel→vinipiel`,
`03. Color tela plastificada→plastificada`, `04. Color papel texturizado→papel`.

Orientación por carpeta de mockups: `11x14 : 8.5x11 (Horizontal)→h`,
`14x11 : 11.5x8 (Vertical)→v`, `10x10 : 8x8→sq`.

## 2. Paletas OFICIALES nuevas (nombres del Drive tal cual, sin el prefijo `NN. `)

- **telas (26)** — orden por su número de archivo: Negro, Café claro, Mostaza obscuro,
  Gris obscuro, Azul marino, Terracota, Ocre, Vino, Café obscuro, Arena, Naranja, Onix,
  Gris claro, Blanco crema, Avena, Verde militar, Lino almendra, Tela plastificada negra,
  Tela plastificada blanca, Tela plastificada roja, Tela plastificada gris,
  Tela plastificada gris obscuro, Tela plastificada azul marino, Blanco brillo,
  Gris claro brillo, Gris brillo. *(Los 6 "Tela plastificada …" y 3 "brillo" dentro de
  Tela: así vienen del taller; queda flag a Anaissa por si quiere separarlos.)*
- **vinipieles (20)**: Nude, Avena, Azul marino, Blanco, Blanco hueso, Terracota,
  Café obscuro, Café, Crema, Gris obscuro, Gris, Negro brilloso, Gris marmoleado, Negro,
  Vino, Taupe, Verde militar, Verde, Rosa metálico, Azul metálico.
  *(Rosa/Azul metálico no tienen mockup: el swap cae al fallback, es esperado.)*
- **telas-plastificadas (6)**: Blanco, Gris claro, Gris, Rojo, Azul obscuro, Negro.
- **papel-texturizado (14)**: Papel Blanco, Papel Negro, Papel Azul, Papel Verde Crema,
  Papel Cafe Claro, Papel Cafe Obscuro, Papel Negro Textura Piel, Papel Gris,
  Papel Verde Hoja, Papel Negro Textura Plastificada, Papel Blanco Textura Plastificado,
  Papel Vino Textura Plastificada, Papel Azul Textura Plastificada — mantener el orden
  numérico del Drive. *(Nombres con prefijo "Papel": se muestran tal cual; flag a Anaissa.)*
- **hotstamping (7)**: Cafe matte, Negro matte, Plateado, Blanco matte, Cobre matte,
  Dorado, Oro rosa. *(Ya no existe "Quemado" ni "Rosa Metálico" del catálogo viejo.)*

Los acentos difieren entre Circulos y Mockups del mismo color ("Cafe claro" vs
"Café claro"): canonizar por **slug** (insensible a acentos) y usar como nombre de
display la variante CON acento cuando exista.

## 3. Convenciones de archivos de salida

- Círculos → `assets/swatch-<paleta>-<slug>.webp` (240×240, cover, webp q80).
  Paleta ∈ {telas, vinipieles, telas-plastificadas, papel-texturizado, hotstamping}.
- Mockups → `_import/files-package/mockups/<handle>-<material>-<orient>-<slug>.webp`
  (máx 1400 px lado largo, webp q78; ~100–200 KB c/u). Estos se suben a
  Admin → Content → Files con drag & drop (los nombres se conservan).
- Fotos principales → `_import/admin-package/product-media/<handle>/<handle>-NN.webp`
  (máx 1800 px, q80) + README con instrucciones de subida como media del producto.
- Home/Menú/View all → `_import/admin-package/<carpeta original>/` (máx 2400 px, q80),
  con README que liste los nombres exactos que espera `templates/index.json`
  (`shopify://shop_images/hero.png`, `bookcase-1..4`, `banner-photobook.png`,
  `image_9..18`) para que el usuario decida el mapeo al subirlas a Files.

## 4. Cambios de theme (van en los mismos commits)

1. **`snippets/op-swatches.liquid`**: regenerar las 5 paletas con los nombres nuevos
   (§2). Cada swatch: `background-image: url({{ 'swatch-<paleta>-<slug>.webp' | asset_url }})`
   (ya NO `file_url`: las texturas viven en el repo y siempre existen) y como
   `background-color` el **color promedio muestreado** del círculo (calcularlo en el
   pipeline con PIL y escribirlo en el data string `Nombre|#hex|<paleta>-<slug>`).
   Mantener la interfaz del snippet (params palette/property/default) intacta.
2. **Defaults de templates**: en los `templates/product.*.json`, los `default` de los
   bloques swatch deben existir en la paleta nueva. Usar: telas→`Verde militar`,
   vinipieles→`Verde militar`, telas-plastificadas→`Blanco`,
   papel-texturizado→`Papel Blanco`, hotstamping→`Dorado`.
3. **`assets/op-product.js`** — swap por material+orientación+color: al construir la URL
   candidata usar la llave `<handle>-<material>-<orient>-<slug>`:
   - material = slug de `properties[Material]` (tela→`tela`, vinipiel→`vinipiel`; para
     cajas/carpetas/porta-planos: `Tela`→tela, `Tela Plastificada`→plastificada,
     `Papel Texturizado`→papel);
   - orient a partir de `properties[Tamaño]`: {11x14,8.5x11}→h · {14x11,11x8.5}→v ·
     {10x10,8x8}→sq · sin tamaño→omitir orient;
   - Orden de sondeo (Image() onload, como ya está implementado):
     a) FILES: `<files-base><llave>.webp` — emitir `data-op-files-base` en
        `sections/product.liquid` con `{{ 'x.webp' | file_url | split: 'x.webp' | first }}`;
     b) ASSETS: `<asset-base><llave>.webp` (fallback);
     c) media del producto con alt == color (ya implementado);
     d) llave corta `<handle>-<slug>` en Files y assets (compatibilidad);
     e) si nada carga, no cambiar la imagen.
   Al cambiar Material o Tamaño también refrescar (ya hay listener de form change).
4. **Verificación** (script en `_import/`): por cada paleta, cada color tiene su
   `swatch-*.webp` en assets; por cada producto 04–07, mockups = paleta × 3 orientaciones
   (tela 26×3, vinipiel 18×3; los 2 metálicos sin mockup se reportan como esperados);
   `node --check` de los JS; JSON de templates válido; theme-check limpio.

## 5. Protocolo de estado (para la sesión que ejecute esto)

Mantener `_import/pipeline-status.md` actualizado y committeado en cada hito:
`DESCARGANDO (n/684)` → `PROCESANDO` → `THEME ACTUALIZADO` → `VERIFICADO` → `LISTO`,
o `BLOQUEADO: <motivo>` (p. ej. la red aún no permite drive.google.com).
Commits pequeños por fase, push a `claude/tienda-requisitos-operacion-15i13g`.
NO tocar `main`. NO subir nada a Shopify (el usuario hace el drag & drop de
`_import/files-package/mockups/` cuando dé su OK).
