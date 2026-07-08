# On Paper — Spec de precios (fuente única)

> **Propósito:** definir, campo por campo, qué opciones de cada producto **alteran el precio final** en la tienda Shopify, para implementar la lógica de cotización.
>
> **Fuente:** respuestas de Anaissa (hoja `2026-07-07-on-paper-precios-anaissa`) cruzadas con el catálogo (`docs/productos.md`).
>
> **Modelo técnico:** los productos **no usan variantes nativas de Shopify**. La personalización son *line-item properties*. Por lo tanto, el precio debe calcularse como **precio base + recargos** según los campos marcados abajo (vía app de cotización, add-ons o Shopify Functions).

> ## ⚠️ AVISO — MONTOS DUMMY
> Todos los valores marcados **`(dummy)`** son **placeholders inventados** para poder implementar y probar la lógica de precios **antes** de que Anaissa entregue los números reales. **NO usar en producción.** Los marcados **`(confirmado)`** sí vienen de Anaissa. Ver sección [Pendientes](#-pendientes-para-cerrar-precios-reemplazar-dummies) para saber qué falta reemplazar.

## Convenciones

- **SÍ / NO** = si la opción cambia el precio.
- `+$X (confirmado)` = recargo real dado por Anaissa.
- `+$X (dummy)` = placeholder para pruebas — reemplazar.
- Color y Hotstamping: **nunca** cambian precio (personalización estética gratis) en todos los productos.

---

## Patrón general (confirmado)

- **Color** y **Hotstamping** → NO cambian precio en ningún producto.
- **Material** → gratis en Photobooks y Libro de Firmas; **con costo** en Bookcase, Memory Box, Cajas, Porta Planos y Carpetas.
- **Tamaño** y **cantidad/volumen de contenido** (fotos, páginas, hojas) → son los que consistentemente mueven el precio.
- **Título / nombres / link / logotipo** → gratis, salvo casos puntuales (p. ej. título en lomo del Layflat).

---

## 01 · Photobook Tradicional  (`photobook-tradicional`)

- **Precio base:** **$1,990.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | 14x11 = base · 11x14 y 10x10 = **+$0 (dummy)** · 11x8.5 y 8x8 = **+$400 (dummy)** |
| Color | NO | — |
| Hotstamping | NO | — |
| Ventana de foto en portada | **SÍ** | **+$200 (confirmado)** |
| Diseño interior | **SÍ** | Minimalista **+$550 (confirmado)** · Tradicional = base |
| Título en portada/lomo | NO | — |
| Número de fotos | **SÍ** | Escalonado *(dummy)*: 0-150 = **+$0** · 250 = **+$400** · 350 = **+$800** · 450 = **+$1,200** · 550 = **+$1,600**. *450 y 550 solo aplican en 11x14 horizontal (confirmado).* |
| Link de fotos | NO | — |

> ⚠️ El dropdown actual del template solo tiene 3 tramos (`0-150 / 151-250 / 251-350`); Anaissa definió hasta 550. **Actualizar el template** al cerrar montos reales.

---

## 02 · Photobook Layflat  (`photobook-layflat`)

- **Precio base:** $2,490.00 (CSV, real)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | 11x14 = base · 10x10 y 11x8.5 = **+$300 (dummy)** · 8x8 = **+$500 (dummy)** |
| Color | NO | — |
| Hotstamping | NO | — |
| Ventana de foto en portada | **SÍ** | **+$200 (confirmado)** |
| Título en portada | NO | — |
| Título en lomo | **SÍ** | **+$200 (confirmado)** |
| Número de fotos y páginas | **SÍ** | *(dummy)* +$300 por cada escalón: 0-50 = +$0 · 0-100 = +$300 · 0-150 = +$600 · 0-200 = +$900 · 0-250 = +$1,200 |
| Link de fotos | NO | — |

---

## 03 · Libro de Firmas  (`libro-de-firmas`)

- **Precio base:** **$1,490.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | *(dummy)* +$300 por cada escalón de tamaño |
| Color | NO | — |
| Hotstamping | NO | — |
| Título portada | NO | — |
| Título lomo | NO | — |
| Tipo de hojas | **SÍ** | *(dummy)* Blanco +$0 · Nombres Impresos +$250 · Nombres Rotulados +$500 |
| Cantidad de hojas | **SÍ** | **+$50 (dummy)** por hoja adicional |
| Agregar más nombres | **SÍ** | **+$150 (dummy)** |

---

## 04 · Bookcase  (`bookcase`)

- **Precio base:** $3,400.00 (CSV, real)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | *(dummy)* Tela +$0 · Vinipiel +$300 |
| Tamaño | **SÍ** | *(dummy)* +$300 por cada escalón de tamaño |
| Color | NO | — |
| Hotstamping | NO | — |
| Título portada/lomo | NO | — |

---

## 05 · Memory Box  (`memory-box`)

- **Precio base:** **$890.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | *(dummy)* Tela +$0 · Vinipiel +$200 |
| Tamaño | **SÍ** | *(dummy)* +$150 por cada escalón de tamaño |
| Color | NO | — |
| Hotstamping | NO | — |
| Título en portada | NO | — |
| Fotos impresas (tamaño caja) | **SÍ** | **+$15 (dummy)** por foto |

---

## 06 · Fotos Impresas  (`fotos-impresas`)

- **Precio base:** $3,400.00 (CSV — revisar si es por paquete)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Tamaño | **SÍ** | *(dummy)* precio por tamaño: 5x7 = $12 · 8x10 = $20 · 10x14 = $35 · 11x14 = $45 · 12x16 = $60 · 20x20 = $120 · 30x30 = $250 · 30x45 = $380 (precio unitario por foto) |
| Link de fotos | NO | — |

> Nota: mínimo 25 fotos (stepper). Precio total = precio unitario × cantidad *(dummy — confirmar si es por foto o paquete)*.

---

## 07 · Cajas Personalizadas  (`cajas-personalizadas`)

- **Precio base:** **$650.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | *(dummy)* Papel Texturizado +$0 · Tela Plastificada +$150 · Tela +$300 |
| Tamaño | **SÍ** | *(dummy)* +$200 por cada escalón de tamaño |
| Color | NO | — |
| Hotstamping | NO | — |
| Medidas de herraje | **SÍ** | *(dummy)* Sin Herraje +$0 · 1" +$120 · 1.5" +$160 · 2" +$200 |
| Espacio para USB | **SÍ** | **+$150 (dummy)** |
| ¿Placa de logotipo? | **SÍ** | **+$250 (dummy)** |
| Agrega tu logotipo | NO | — |

---

## 08 · Porta Planos  (`porta-planos`)

- **Precio base:** **$750.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | *(dummy)* Papel Texturizado +$0 · Tela Plastificada +$150 · Tela +$300 |
| Color | NO | — |
| Hotstamping | NO | — |
| ¿Placa de logotipo? | **SÍ** | **+$250 (dummy)** |
| Agrega tu logotipo | NO | — |

---

## 09 · Carpetas  (`carpetas`)

- **Precio base:** **$550.00 (dummy)**

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | *(dummy)* Papel Texturizado +$0 · Tela Plastificada +$150 · Tela +$300 |
| Tamaño | **SÍ** | *(dummy)* +$200 por cada escalón de tamaño |
| Color | NO | — |
| Hotstamping | NO | — |
| Medidas de herraje | **SÍ** | *(dummy)* Sin Herraje +$0 · 1" +$120 · 1.5" +$160 · 2" +$200 |
| ¿Placa de logotipo? | **SÍ** | **+$250 (dummy)** |
| Agrega tu logotipo | NO | — |

---

## 10 · Certificado de Regalo / Giftcard  (`certificado-de-regalo`)

- **Precio base:** definido por el monto elegido (no es fijo)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Elige el regalo perfecto (A/B) | NO | — (solo bifurca el flujo) |
| Producto (si elige A) | **SÍ** | El precio = precio del producto elegido |
| Crédito / Saldo (si elige B) | **SÍ** | El precio = monto que escribe el cliente |
| Nombre de quien recibe | NO | — |
| Forma de entrega | NO | — |
| Datos de contacto y envío | NO* | *Por confirmar con Anaissa si aplica* |

---

## Resumen de precios base (dummy vs. real)

| # | Producto | Precio base | Origen |
|---|----------|-------------|--------|
| 1 | Photobook Tradicional | $1,990.00 | **dummy** |
| 2 | Photobook Layflat | $2,490.00 | real (CSV) |
| 3 | Libro de Firmas | $1,490.00 | **dummy** |
| 4 | Bookcase | $3,400.00 | real (CSV) |
| 5 | Memory Box | $890.00 | **dummy** |
| 6 | Fotos Impresas | $3,400.00 | real (CSV, revisar) |
| 7 | Cajas Personalizadas | $650.00 | **dummy** |
| 8 | Porta Planos | $750.00 | **dummy** |
| 9 | Carpetas | $550.00 | **dummy** |
| 10 | Giftcard | dinámico | n/a |

---

## 🔴 Pendientes para cerrar precios (reemplazar dummies)

1. **Precios base reales** de: Photobook Tradicional, Libro de Firmas, Memory Box, Cajas, Porta Planos, Carpetas.
2. **Montos exactos** de todos los campos marcados `(dummy)` en 01–09.
3. **Tramos reales del "Número de fotos"** del Photobook Tradicional (llega hasta 550) + actualizar el template.
4. **Escalonado del Layflat (02):** montos reales por tramo de fotos/páginas.
5. **Confirmar** si "Datos de contacto y envío" del Giftcard afectan el precio.
6. **Fotos Impresas (06):** confirmar si el precio es por foto o por paquete.

## Notas de implementación

- Traducir cada regla `SÍ` a un **recargo** sobre el precio base del producto.
- Reglas condicionadas por tamaño (p. ej. tramos 450/550 solo en 11x14) requieren lógica dependiente entre campos → app de cotización o Shopify Functions, no solo properties estáticas.
- Al llegar los montos reales, basta reemplazar los valores `(dummy)` por los definitivos y quitar el aviso de arriba.
