# On Paper — Spec de precios (fuente única)

> **Propósito:** definir, campo por campo, qué opciones de cada producto **alteran el precio final** en la tienda Shopify, para implementar la lógica de cotización.
>
> **Fuente:** respuestas de Anaissa (hoja `2026-07-07-on-paper-precios-anaissa`) cruzadas con el catálogo (`docs/productos.md`).
>
> **Modelo técnico:** los productos **no usan variantes nativas de Shopify**. La personalización son *line-item properties*. Por lo tanto, el precio debe calcularse como **precio base + recargos** según los campos marcados abajo (vía app de cotización, add-ons o Shopify Functions).

## Convenciones

- **SÍ / NO** = si la opción cambia el precio.
- `+$X` = recargo confirmado por Anaissa.
- **`TBD`** = Anaissa confirmó que **sí cambia**, pero **falta el monto**.
- Color y Hotstamping: **nunca** cambian precio (personalización estética gratis) en todos los productos.

---

## Patrón general (confirmado)

- **Color** y **Hotstamping** → NO cambian precio en ningún producto.
- **Material** → gratis en Photobooks y Libro de Firmas; **con costo** en Bookcase, Memory Box, Cajas, Porta Planos y Carpetas.
- **Tamaño** y **cantidad/volumen de contenido** (fotos, páginas, hojas) → son los que consistentemente mueven el precio.
- **Título / nombres / link / logotipo** → gratis, salvo casos puntuales (p. ej. título en lomo del Layflat).

---

## 01 · Photobook Tradicional  (`photobook-tradicional`)

- **Precio base:** `TBD` (sin precio en CSV)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | 11x14 y 10x10 = mismo precio · 11x8.5 y 8x8 = otro precio · (14x11 `TBD`) |
| Color | NO | — |
| Hotstamping | NO | — |
| Ventana de foto en portada | **SÍ** | **+$200** |
| Diseño interior | **SÍ** | Minimalista **+$550** (Tradicional = base) |
| Título en portada/lomo | NO | — |
| Número de fotos | **SÍ** | Escalonado: 0-150 / 250 / 350 / 450 / 550 — precio distinto por tramo. *450 y 550 solo aplican en 11x14 horizontal.* Montos por tramo `TBD` |
| Link de fotos | NO | — |

> ⚠️ Ojo: los tramos de "Número de fotos" que Anaissa listó (hasta 550) **no coinciden** con el dropdown actual del template (0-150 / 151-250 / 251-350). Hay que **actualizar el template** con los tramos reales.

---

## 02 · Photobook Layflat  (`photobook-layflat`)

- **Precio base:** $2,490.00 (CSV)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | 11x14 = un precio · 10x10 y 11x8.5 = otro · 8x8 = otro. Montos `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Ventana de foto en portada | **SÍ** | **+$200** |
| Título en portada | NO | — |
| Título en lomo | **SÍ** | **+$200** |
| Número de fotos y páginas | **SÍ** | Cada escalón de cantidad aumenta el precio. Montos por tramo `TBD` |
| Link de fotos | NO | — |

---

## 03 · Libro de Firmas  (`libro-de-firmas`)

- **Precio base:** `TBD`

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | NO | — |
| Tamaño | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Título portada | NO | — |
| Título lomo | NO | — |
| Tipo de hojas | **SÍ** | `TBD` |
| Cantidad de hojas | **SÍ** | `TBD` (por hoja) |
| Agregar más nombres | **SÍ** | `TBD` |

---

## 04 · Bookcase  (`bookcase`)

- **Precio base:** $3,400.00 (CSV)

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | `TBD` |
| Tamaño | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Título portada/lomo | NO | — |

---

## 05 · Memory Box  (`memory-box`)

- **Precio base:** `TBD`

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | `TBD` |
| Tamaño | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Título en portada | NO | — |
| Fotos impresas (tamaño caja) | **SÍ** | `TBD` (por foto) |

---

## 06 · Fotos Impresas  (`fotos-impresas`)

- **Precio base:** $3,400.00 (CSV) — *revisar: probablemente es precio por paquete/tamaño*

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Tamaño | **SÍ** | `TBD` (precio por tamaño) |
| Link de fotos | NO | — |

> Nota: cantidad mínima 25 fotos (stepper). Confirmar si el precio es por foto o por paquete.

---

## 07 · Cajas Personalizadas  (`cajas-personalizadas`)

- **Precio base:** `TBD`

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | `TBD` |
| Tamaño | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Medidas de herraje | **SÍ** | `TBD` (por medida) |
| Espacio para USB | **SÍ** | `TBD` |
| ¿Placa de logotipo? | **SÍ** | `TBD` |
| Agrega tu logotipo | NO | — |

---

## 08 · Porta Planos  (`porta-planos`)

- **Precio base:** `TBD`

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| ¿Placa de logotipo? | **SÍ** | `TBD` |
| Agrega tu logotipo | NO | — |

---

## 09 · Carpetas  (`carpetas`)

- **Precio base:** `TBD`

| Opción | ¿Cambia? | Regla de precio |
|--------|:---:|-----------------|
| Material | **SÍ** | `TBD` |
| Tamaño | **SÍ** | `TBD` |
| Color | NO | — |
| Hotstamping | NO | — |
| Medidas de herraje | **SÍ** | `TBD` |
| ¿Placa de logotipo? | **SÍ** | `TBD` |
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

## 🔴 Pendientes para cerrar precios (falta de Anaissa)

1. **Montos exactos (`+$X` / precio por tramo/opción) de los productos 03–10.** Solo llegaron completos para el 01 y parte del 02.
2. **Precios base** de los 7 productos sin precio en CSV: Photobook Tradicional, Libro de Firmas, Memory Box, Cajas Personalizadas, Porta Planos, Carpetas (y regla de Giftcard).
3. **Tramos del "Número de fotos"** — actualizar los tramos reales (01 llega hasta 550; el template actual solo tiene 3 tramos) y sus montos.
4. **Escalonado del Layflat (02):** montos por cada tramo de fotos/páginas.
5. **Confirmar** si "Datos de contacto y envío" del Giftcard afectan el precio.
6. **Fotos Impresas (06):** confirmar si el precio es por foto o por paquete.

## Notas de implementación (cuando lleguen los montos)

- Traducir cada regla `SÍ` a un **recargo** sobre el precio base del producto.
- Reglas condicionadas por tamaño (p. ej. tramos 450/550 solo en 11x14) requieren lógica dependiente entre campos → considerar app de cotización o Shopify Functions, no solo properties estáticas.
- Actualizar los templates `product.*.json` donde las opciones no coincidan con lo definido por Anaissa (caso "Número de fotos" del 01).
