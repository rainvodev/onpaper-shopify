# On Paper — guía para Claude (léeme primero)

Theme Shopify OS 2.0 **custom** de On Paper (taller artesanal de photobooks e impresión, Monterrey MX),
construido por RAINVO sobre el theme **Skeleton** de Shopify + el framework CSS **Lumos**.
Este archivo es el punto de entrada de cualquier sesión de Claude Code. La documentación
completa vive en `docs/` (mapa abajo). Si es tu primera sesión, lee `docs/handoff.md` completo.

## Lo esencial en 60 segundos

- **`main` es producción.** La integración GitHub de Shopify publica cada push a `main` en el theme
  conectado de `on-paper-t6vfjrak.myshopify.com`. No hay build step: todo es Liquid/CSS/JS/JSON
  committeado tal cual.
- **El editor de Shopify también escribe en este repo.** Personalizar, el editor de idiomas y el editor
  de código regresan como commits de `shopify[bot]`. Antes de cualquier push:
  `git pull --no-rebase origin main`. **Nunca** `rebase`, `--amend` ni `--force` sobre `main`.
- **Precio mostrado = precio cobrado, siempre por variantes nativas.** La única fuente de precios es
  `_import/products-variants.csv`, generado por `_import/gen_variants_csv.py`. Las line-item
  properties (Color, Hotstamping, títulos, links) **nunca** cambian el precio.
- **Los nombres de los colores son un contrato con el taller**: viajan al pedido y forman la llave de las
  imágenes (`mockup-<material>-<tamaño>-<color>.webp` en Files). No renombrar sin avisar.
- **Nada pesado en `main`** (nada > 1 MB): mockups y fotos van a Shopify Files; el archivo histórico de
  imágenes vive en la rama `archivo-imagenes`. Un repo pesado rompe la conexión GitHub → Shopify.
- **Antes de cada push**: theme check con 0 errores, `node --check` en cada JS tocado, JSON válido.
  El CI (`.github/workflows/ci.yml`) corre theme check en cada push; si queda rojo, arréglalo.

## Cómo presentarle el trabajo a Anaissa (obligatorio)

Anaissa (dueña de On Paper) no es técnica. **Todo lo que le entregues se le muestra como una página
HTML renderizada en su misma ventana** (herramienta de Artifacts / vista previa del panel), nunca como
markdown, listas de archivos o diffs. Regla práctica: si ella tiene que "imaginar" cómo queda algo, no
la has terminado de presentar.

- **Qué lleva la página:** un resumen de 3 líneas en lenguaje llano; qué cambió o qué propones con
  **antes/después** (capturas, mockups o el componente mismo reproducido con los estilos del theme);
  qué tiene que hacer ella (pasos con la ruta exacta del Admin: "Productos → Libro de Firmas →
  Variantes"); qué decisión le toca y sus opciones; y al final, plegado, "Detalles técnicos" (archivos,
  commits, checks) para RAINVO.
- **Cómo se ve:** usa la plantilla `docs/plantillas/reporte-anaissa.html` (marca de On Paper: crema,
  olive, serif); `docs/plantillas/ejemplo-entrega-anaissa.html` es una página real completa como modelo. Español de México, tuteo, sin jerga: "el menú de arriba", no "header-group.json".
- **Una página por tema, actualizada.** Republica a la misma URL en cada avance en vez de crear una
  página nueva por mensaje; así ella siempre abre el mismo link.
- **Diseño y animación:** enséñale el resultado en la propia página (el botón, la sección, el mockup
  con sus colores reales) antes de tocar la tienda; que ella apruebe viendo, no leyendo.
- **En el chat:** tres líneas y el link. Nada más.
- Si en tu entorno no existe la herramienta de Artifacts, genera el HTML como archivo y muéstralo
  renderizado en la ventana; como último recurso, explica en lenguaje llano con una lista corta.

## Mapa de la documentación

| Archivo | Qué contiene |
|---|---|
| `docs/handoff.md` | Diagnóstico del sitio al 2-sep-2026 y plan de entrega. **Leer primero.** |
| `docs/reglas.md` | Reglas duras del proyecto (no negociables) y por qué existen. |
| `docs/styleguide.md` | Marca: color, tipografía, espaciado, layout, movimiento, imágenes, voz. |
| `docs/componentes.md` | Arquitectura del theme + catálogo de secciones, snippets, assets y templates. |
| `docs/elementos.md` | Elementos de UI (botones, campos, swatches, cards, paneles) con sus clases y estados. |
| `docs/usos.md` | Recetas paso a paso para las tareas comunes (contenido, productos, precios, colores, idiomas). |
| `docs/migracion.md` | Runbook operativo del Admin (checklist viva de configuración y lanzamiento). |
| `docs/imagenes-spec.md` | Pipeline de imágenes y convenciones de nombres de mockups/swatches. |
| `docs/precios-spec.md`, `docs/productos.md` | Históricos (superados). Sirven como referencia de reglas de negocio. |
| `README.md` | Resumen del proyecto para humanos. |

## Estructura del repo

```
layout/theme.liquid        shell HTML: fuentes, CSS, header/footer groups, cart drawer, scripts
templates/*.json           qué secciones tiene cada página (product.<handle>.json = bloques por producto)
sections/op-*.liquid       kit On Paper (header, footer, hero, about, bookcase, gallery, cta, faq, contacto…)
sections/product.liquid    página de producto por bloques (pills/swatch/size/dropdown/radio/text…)
sections/*-group.json      header-group / footer-group (settings del header y footer)
snippets/op-*.liquid       swatches, sizes, field-group, logo, mini card, estilos de cuenta
assets/op-*.js|css         header, product, variants, cart, gsap, cursor, transition, anim, brand.css
assets/lumos.css           framework (NO editar) · assets/critical.css reset + grid de secciones
assets/swatch-*.webp       texturas de los círculos de color (en el theme, 71 archivos)
config/settings_schema.json  settings globales · config/settings_data.json  valores (autogenerado)
locales/es.default.json    idioma principal · locales/en.json  inglés (lo gestiona el editor de idiomas)
_import/                   CSV de productos+variantes, generador de precios, manifest del Drive
docs/                      documentación (este mapa)
.github/workflows/ci.yml   theme check en cada push · .shopifyignore  excluye docs/_import/README del theme
```

## Comandos

```bash
npx -y @shopify/cli@latest theme check        # linter, igual que el CI. OK = 0 errores (9 warnings RemoteAsset de fuentes son normales)
node --check assets/op-product.js              # después de tocar cualquier JS
python3 - <<'PY'                               # validar un JSON que lleva el encabezado /* … */ de Shopify
import json,re,sys; raw=open('locales/en.json').read(); json.loads(re.sub(r'^\s*/\*.*?\*/','',raw,flags=re.S)); print('ok')
PY
shopify theme dev --store on-paper-t6vfjrak.myshopify.com   # preview local con hot reload (pide login)
```

## Flujo de trabajo

1. **Contenido** (textos, imágenes, orden de secciones, settings) → editor de Shopify (Personalizar).
   No lo edites a mano en los JSON salvo necesidad real: el editor los pisa.
2. **Código** → cambio pequeño y verificado directo en `main` (pull → cambio → checks → push), o rama
   `claude/<tema>` + PR si es grande. El push a `main` ya es el deploy.
3. **Precios** → generador + CSV + import con overwrite en Admin (receta en `docs/usos.md`).
4. **Colores / mockups nuevos** → receta en `docs/usos.md`; los nombres deben ser los del taller.
5. Al terminar, di explícitamente qué **no** pudiste verificar. Desde una sesión remota no ves el
   storefront salvo que la red permita `*.myshopify.com`; pide una captura si hace falta.

## Convenciones

- Prefijo `op-` en secciones, snippets, assets y clases del kit: `.op-<bloque>_<elemento>`,
  modificador `.op-x--variante`, estado `.is-abierto|activo|…`, hooks de JS con `data-op-*`.
- Español en labels del editor, comentarios de código, commits de contenido y docs. Cada archivo
  Liquid/JS empieza con un comentario que dice qué hace y cómo se usa.
- Strings visibles: `{{ 'clave' | t }}` (locales) para el chrome estándar, o setting de sección con
  default en español. Nunca texto fijo sin salida al editor.
- Cada sección expone padding arriba/abajo (`padding_top`/`padding_bottom`) con el mismo `clamp()` fluido.
- Commits: título imperativo + cuerpo que explica el **porqué** (ver `git log`).

## Qué no hacer

- No instalar page builders ni apps para lograr un diseño: se construye la sección.
- No tocar `assets/lumos.css`. La marca vive en `assets/brand.css`; cada componente trae su
  `{% stylesheet %}`.
- No editar a mano `config/settings_data.json`, `templates/*.json`, `sections/*-group.json` ni
  `locales/*.json` sin entender que llevan encabezado *auto-generated* y el editor puede sobrescribirlos.
- No cambiar los nombres de opción de variantes (`Tamaño`, `Número de fotos`, …) ni los labels de bloque
  que coinciden con ellos: `op-variants.js` los empareja por nombre exacto.
- No activar los productos con precios dummy (Libro de Firmas, Cajas, Carpetas, Porta Planos) en una
  tienda sin password hasta tener los montos reales.
- No importar el CSV de precios con overwrite sin antes sincronizar el generador con el Admin: Anaissa
  edita precios ahí y el import los pisaría (receta en `docs/usos.md`).
- Monedas de la tienda: solo MXN, USD y EUR (acordado 2-sep-2026). Se configura en Settings → Markets, no
  en el theme.
