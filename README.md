# On Paper — Tema Shopify (base)

Tema OS 2.0 de **On Paper**, partiendo del **Skeleton** de Shopify + el framework **Lumos** de RAINVO. Construido con la skill shopify-os2.

- **Dev store:** onpaper-fafjay65.myshopify.com
- **Transferencia al lanzamiento:** a taller@onpaper.mx (Anaissa activa plan/pago).

## Qué trae ya
- Estructura Skeleton completa (layout, templates JSON, sections, blocks, snippets, locales).
- `assets/lumos.css` — núcleo de Lumos (tokens, utilidades u-*, temas, runtime).
- `assets/brand.css` — overrides de marca On Paper (PLACEHOLDER; afinar con el XD: colores y, si aplica, fuentes).
- `layout/theme.liquid` — carga fuentes (Montserrat + Open Sans), lumos.css y brand.css.
- `sections/op-hero.liquid` — hero de ejemplo con clases Lumos, ya puesto en la Home (templates/index.json).

## Primeros pasos (en tu maquina, con el CLI)
Requisitos: Node 22.12+ y Shopify CLI (`npm install -g @shopify/cli@latest`).

1. Borra el .git heredado del Skeleton (el sandbox no me dejo): `rm -rf .git`
2. Conecta y previsualiza:
   cd "Builds/on-paper-shopify"
   shopify theme dev --store onpaper-fafjay65.myshopify.com
   (La primera vez pide login en el navegador.) Abre http://127.0.0.1:9292
3. Sube como tema sin publicar (para revision):
   shopify theme check
   shopify theme push --unpublished
4. Publicar SOLO al final: shopify theme publish

## Siguiente
- Afinar brand.css con los tokens reales del diseño On Paper (XD).
- Activar Shopify Markets: ES/EN + multi-moneda.
- Cargar productos (cuando Anaissa pase link de datos + fotos).
- Construir el kit de secciones del diseño (nav idioma/moneda/carrito, footer, secciones editoriales).
