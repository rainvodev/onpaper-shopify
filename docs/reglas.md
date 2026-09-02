# Reglas del proyecto On Paper

Reglas duras: existen porque romperlas cuesta dinero, pedidos mal cobrados o un deploy caído.
Cada una dice **qué**, **por qué** y **cómo cumplirla**. Si una tarea te obliga a romper alguna,
detente y dilo antes de hacerlo.

## 1. `main` es producción

- **Qué:** cada push a `main` se publica en la tienda al instante (integración GitHub de Shopify).
- **Por qué:** no hay staging automático; un error en `main` lo ven los clientes.
- **Cómo:** verifica antes de pushear (theme check 0 errores, `node --check`, JSON válido). Para cambios
  grandes usa rama + PR y revisa el preview; para probar sin publicar, `shopify theme push --unpublished`.

## 2. El repo es bidireccional: pull antes de push, nunca reescribas historia

- **Qué:** el editor de Shopify (Personalizar, idiomas, editor de código) commitea como `shopify[bot]`.
- **Por qué:** si haces push sin traer esos commits, el push se rechaza; si reescribes historia, la
  integración se desincroniza y se pierden cambios de Anaissa.
- **Cómo:** `git pull --no-rebase origin main` antes de cada push. Prohibido `rebase`, `--amend` de
  commits ya pusheados y `--force` en `main`.

## 3. Archivos autogenerados

- **Qué:** `config/settings_data.json`, `templates/*.json`, `sections/header-group.json`,
  `sections/footer-group.json` y `locales/*.json` llevan el encabezado *auto-generated* de Shopify.
- **Por qué:** el editor los reescribe completos; una edición manual puede perderse o, peor, pisar lo
  que Anaissa acaba de cambiar en el editor.
- **Cómo:** contenido y settings se cambian en el editor. Si necesitas editarlos por código (p. ej. agregar
  un bloque nuevo a un template de producto), haz pull justo antes, edita, valida el JSON y pushea rápido.

## 4. El precio solo lo definen las variantes nativas

- **Qué:** todo lo que cambia el precio es una opción de variante de Shopify; lo que no, es line-item
  property. El precio del PDP lo pone `op-variants.js` con el precio real de la variante.
- **Por qué:** el checkout cobra únicamente por variante; cualquier precio "calculado" en la página que no
  sea el de la variante es un precio falso.
- **Cómo:** precios se cambian en `_import/gen_variants_csv.py` → regenerar CSV → importar con overwrite.
  `op-pricing.js` es un fallback vacío a propósito: no lo uses para cobrar.

## 5. Nombres de opción y labels de bloque son idénticos

- **Qué:** `op-variants.js` empareja `properties[<label>]` del formulario con la opción de variante del
  mismo nombre (`Tamaño`, `Número de fotos`, `Tipo de hojas`, `Cantidad de hojas`, `Material`, `Medidas
  de herraje`, `Fotos impresas (opcional)`).
- **Por qué:** si el label del bloque y el nombre de la opción difieren, la variante no se selecciona y se
  cobra la primera.
- **Cómo:** al renombrar un label en el template, renombra la opción en el CSV (y viceversa). Los valores
  también deben coincidir exactamente (acentos incluidos).

## 6. Los nombres de color son del taller

- **Qué:** los nombres de las paletas en `snippets/op-swatches.liquid` son los oficiales del taller.
- **Por qué:** el nombre viaja al pedido (el taller produce con ese nombre) y su slug es la llave de la
  imagen del mockup y de la textura del swatch.
- **Cómo:** para agregar o cambiar un color sigue `docs/usos.md` (paleta + swatch + mockups). Nunca
  "corrijas" ortografía por tu cuenta.

## 7. Tamaños: el taller nombra ALTO×ANCHO, la tienda ANCHO×ALTO

- **Qué:** los archivos de mockup usan la convención del taller (`14x11` en el archivo = `11x14` en la
  tienda). `op-product.js` traduce con el mapa `TALLER_SIZE`.
- **Por qué:** renombrar 264 archivos en Files es lento y propenso a error; la traducción en código es la
  fuente de verdad.
- **Cómo:** no renombres mockups en Files; si llega un tamaño nuevo, agrégalo al mapa.

## 8. Nada pesado en `main`

- **Qué:** ningún archivo > 1 MB en `main`; el repo debe seguir en unos pocos MB.
- **Por qué:** la conexión GitHub → Shopify falló con el repo a 550 MB ("Not all files could be created").
- **Cómo:** mockups y fotos van a Shopify Files o a la media del producto; el archivo histórico está en
  la rama `archivo-imagenes` (nunca mergearla a `main`).

## 9. Theme check limpio y JS que compila

- **Qué:** 0 errores en `theme check`; los 9 warnings `RemoteAsset` por las fuentes de Google son
  aceptados. `node --check` en cada JS tocado.
- **Por qué:** un Liquid roto tumba la página entera; el CI marca rojo el repo.
- **Cómo:** corre los comandos de `CLAUDE.md` antes de cada push.

## 10. Locales completos

- **Qué:** `locales/es.default.json` es el idioma principal; `locales/en.json` debe contener **todas** sus
  claves (theme check `MatchingTranslations`).
- **Por qué:** una clave faltante muestra "Translation missing" en el storefront en inglés y rompe el CI.
- **Cómo:** al agregar una clave en español, agrega su traducción en `en.json`. Los archivos llevan el
  encabezado de Shopify: consérvalo.

## 11. Todo texto visible tiene salida al editor

- **Qué:** nada de copy fijo en Liquid. O va por `{{ 'clave' | t }}` o por un setting con default.
- **Por qué:** Anaissa gestiona el contenido sin tocar código.
- **Cómo:** revisa el schema de la sección antes de escribir un texto; añade el setting si no existe.

## 12. Sin apps para diseño

- **Qué:** no instalar page builders ni apps de "secciones" para lograr un layout.
- **Por qué:** costo mensual, dependencia y pérdida de control del código.
- **Cómo:** se construye la sección con el kit (`docs/componentes.md`). Apps solo para funciones que Shopify
  no da nativamente (p. ej. descuentos escalonados) y avisando el costo.

## 13. Movimiento accesible y sin bloqueos

- **Qué:** toda animación respeta `prefers-reduced-motion`; nada queda oculto si el JS falla.
- **Por qué:** accesibilidad y robustez (Skeleton + GSAP están blindados así).
- **Cómo:** usa `data-reveal`/`data-mask` del motor existente; si agregas CSS animado, incluye la media
  query de reduced-motion y un estado final visible sin JS.

## 14. `lumos.css` no se toca

- **Qué:** el framework se vendoriza tal cual.
- **Por qué:** es la base compartida de RAINVO; los overrides viven en `brand.css` y en cada sección.
- **Cómo:** para cambiar un token, redefine la variable en `assets/brand.css` (ya se hace con colores y
  fuentes).

## 15. Seguridad y accesos

- No commitear tokens ni credenciales (Theme Access, API keys). Se pasan por variables de entorno.
- Los accesos al Admin, Partners, GitHub y dominio se documentan en `docs/handoff.md`, no en el código.

## 16. A Anaissa se le muestra todo en HTML, en su ventana

- **Qué:** cada entrega, diagnóstico, propuesta u opción para Anaissa se presenta como página HTML
  renderizada (Artifacts) con la plantilla `docs/plantillas/reporte-anaissa.html`; en el chat, tres
  líneas y el link.
- **Por qué:** ella no es técnica; un diff o una lista de archivos no le permite decidir ni aprobar.
  Ver el botón, la sección o el mockup real evita malentendidos y retrabajo.
- **Cómo:** resumen llano → antes/después → pasos exactos del Admin → decisión y opciones → detalles
  técnicos plegados. Una página por tema, republicada en la misma URL. Detalle en `CLAUDE.md`.
