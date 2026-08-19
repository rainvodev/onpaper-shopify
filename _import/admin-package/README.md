# Paquete Admin — fotos principales, home, menú y colección

Imágenes optimizadas listas para cargarse en el Admin de la tienda definitiva.

## product-media/<handle>/ (4 fotos por producto)
Subirlas como **media del producto** (Products → producto → Media → drag & drop,
en el orden 01→04; la 01 queda como imagen destacada). Opcional: ponerle a alguna
el alt con el nombre exacto de un color para que el swap la use como fallback.

## 01. Home Page/
Imágenes de las secciones del home. El template actual (`templates/index.json`)
referencia estos nombres en Files: `hero.png`, `hero-2.png`, `hero-3.png`,
`bookcase-1..4.png`, `banner-photobook.png`, `image_9..18.png`.
Dos opciones al subirlas a Content → Files:
a) Renombrar cada webp al nombre correspondiente antes de subir (mismo nombre,
   la referencia se resuelve sola), o
b) Subirlas con su nombre actual y re-seleccionarlas en el editor de themes
   (Personalizar → Home → cada sección → picker de imagen). **Recomendado b)**:
   más control visual y sin depender de la extensión.
Mapeo sugerido: Sección 01 → hero del slider · Sección 02 (Carrusel) → galería ·
Sección 03 → banner photobook · Sección 04 (Best Sellers) → tarjetas best sellers ·
Sección 05 (Personalizados) → CTA de proyectos personalizados.

## 02. Menú/
3 imágenes para el panel "Products" y 3 para "Collections" del mega-menú.
El menú toma las imágenes de los productos/colecciones destacados, así que lo más
directo es usarlas como media de esos productos o imagen de la colección.

## 03. On paper shop (View all)/
Una imagen por producto (10) — ideales como imagen de tarjeta en la colección
general si algún producto aún no tiene media propia.
