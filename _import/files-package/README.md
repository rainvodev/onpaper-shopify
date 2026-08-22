# Paquete para Shopify Files — mockups por color (v2, originales sin comprimir)

**Qué es:** los 264 mockups corregidos (set ÚNICO compartido entre Photobook
Tradicional, Layflat, Libro de Firmas y Book case): Tela (26 colores) y
Vinipiel (18) × los 6 tamaños exactos (8x8, 10x10, 8.5x11, 11x14, 11x8.5,
14x11). **Originales byte por byte, sin recomprimir** (~119 MB).

Convención: `mockup-<material>-<tamaño>-<color>.webp`
(ej. `mockup-tela-8-5x11-cafe-claro.webp` — el punto del tamaño se vuelve guión).

**Sustitución en Admin → Content → Files (en este orden):**
1. **Borrar los 528 viejos** (estaban mal y ya nada los usa): en el buscador de
   Files filtra `photobook-`, luego `libro-de-firmas-`, luego `bookcase-`;
   selecciona todo y Delete en cada pasada.
2. **Subir los 264 nuevos** de esta carpeta de un jalón (drag & drop).
3. Hard refresh en un PDP: al elegir material + tamaño + color debe salir el
   mockup del tamaño exacto.

Notas:
- El theme sondea primero esta llave v2; mantiene la vieja solo como fallback
  de transición, así que el orden borrar→subir no rompe nada en el ínterin.
- Vinipiel "Rosa metálico" y "Azul metálico" siguen sin mockup (así vienen del
  taller): al elegirlos se conserva la imagen anterior — esperado.
- Subir en la tienda **definitiva** (los Files no se transfieren entre tiendas).
