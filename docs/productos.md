# Catálogo de Productos — On Paper

> Documento generado a partir del theme (`_import/products.csv` + templates `product.*.json` + `sections/product.liquid`).
>
> **Nota importante sobre "variantes":** en esta tienda los productos **no usan variantes nativas de Shopify**. La personalización se construye con **line-item properties** (campos que viajan en cada línea del carrito), definidos por bloques en el template de cada producto. Por eso, abajo cada producto lista sus **campos personalizables (custom fields)**, que cumplen la función de variantes.

- **Vendor:** On Paper (todos)
- **Estado actual:** todos en `draft` / `Published = FALSE`
- **Moneda de precios:** valores tal cual aparecen en el CSV (la mayoría sin precio definido aún)

---

## Resumen de productos

| # | Handle | Título | Tipo | Precio (CSV) | Tags | Estado |
|---|--------|--------|------|--------------|------|--------|
| 1 | `photobook-tradicional` | Photobook Tradicional | Photobooks | — | photobook, recuerdos | draft |
| 2 | `photobook-layflat` | Photobook Layflat | Photobooks | 2490.00 | photobook, layflat, recuerdos | draft |
| 3 | `libro-de-firmas` | Libro de Firmas | Libros | — | libro-de-firmas, bodas, eventos | draft |
| 4 | `bookcase` | Bookcase | Cajas | 3400.00 | bookcase, estuche | draft |
| 5 | `memory-box` | Memory Box | Cajas | — | memory-box, recuerdos | draft |
| 6 | `fotos-impresas` | Fotos Impresas | Impresiones | 3400.00 | fotos, impresiones | draft |
| 7 | `cajas-personalizadas` | Cajas Personalizadas | Cajas | — | cajas, personalizado | draft |
| 8 | `porta-planos` | Porta Planos | Accesorios | — | porta-planos, accesorios | draft |
| 9 | `carpetas` | Carpetas | Accesorios | — | carpetas, papeleria | draft |
| 10 | `certificado-de-regalo` | Certificado de Regalo (Giftcard) | Gift Card | — | gift-card, regalo | draft |

---

## 1. Photobook Tradicional — `photobook-tradicional`

> Libros tradicionales cosidos, encuadernados artesanalmente. Papel couché 200 gr. **Envío: 20 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Vinipiel, Impresión | Tela |
| Tamaño | size (`photobook`) | 14x11, 11x14, 10x10, 8.5x11, 11x8.5, 8x8 (pulgadas) | 14x11 |
| Color | swatch (`fabric-photobook`, 30 colores) | ver [Paleta Photobook](#paleta-fabric-photobook-30-colores) | Gris claro |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| Ventana de foto en portada | radio | Sí, No | No |
| Diseño interior | radio | Minimalista, Tradicional | Minimalista |
| Título en portada y lomo (opcional) | text | — (texto libre) | — |
| Número de fotos | dropdown | 0-150 fotos, 151-250 fotos, 251-350 fotos | — |
| Link de fotos (opcional) | url | URL (solo Google Drive o WeTransfer) | — |

- **Cantidad:** dropdown. *A partir de 6 libros o más, se requiere cotización personalizada.*

---

## 2. Photobook Layflat — `photobook-layflat`

> Páginas continuas (no cosido), abre completamente en plano. Papel fotográfico, acabado premium. **Precio: 2490.00. Envío: 20 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Vinipiel, Impresión | Vinipiel |
| Tamaño | size (`photobook`) | 14x11, 11x14, 10x10, 8.5x11, 11x8.5, 8x8 (pulgadas) | 11x14 |
| Color | swatch (`fabric-standard`, 15) | ver [Paleta Standard](#paleta-fabric-standard-15-colores) | Verde militar |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Plateado |
| Ventana de foto en portada | radio | Sí, No | No |
| Título en portada | text | — (texto libre) | — |
| Título en lomo (opcional) | text | — (texto libre) | — |
| Número de fotos y páginas | dropdown | 0-50 fotos (20-30 pág), 0-100 fotos (30-40 pág), 0-150 fotos (60-70 pág), 0-200 fotos (80-90 pág), 0-250 fotos (100 pág) | — |
| Link de fotos (opcional) | url | URL (solo Google Drive o WeTransfer) | — |

- **Cantidad:** dropdown. *A partir de 6 libros o más, se requiere cotización personalizada.*

---

## 3. Libro de Firmas — `libro-de-firmas`

> Libro de firmas para bodas/eventos, totalmente personalizado. **Envío: 10-15 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Vinipiel, Impresión | Vinipiel |
| Tamaño | size (`firmas-bookcase`) | 14x11, 11x14, 8.5x11, 11x8.5, 8x8, 10x10 (pulgadas) | 11x14 |
| Color | swatch (`fabric-standard`, 15) | ver [Paleta Standard](#paleta-fabric-standard-15-colores) | Verde militar |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Dorado |
| Título en portada | text | — (texto libre) | — |
| Título en lomo (opcional) | text | — (texto libre) | — |
| Tipo de hojas | dropdown | Hojas en Blanco, Nombres Impresos, Nombres Rotulados | — |
| Cantidad de hojas | stepper | mínimo 1 | 1 |
| Agregar más nombres (opcional) | textarea | — (texto libre) | — |

- **Cantidad:** dropdown.

---

## 4. Bookcase — `bookcase`

> Estuche/funda rígida con el mismo material y diseño que los libros. **Precio: 3400.00. Envío: 15 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Vinipiel | Vinipiel |
| Tamaño | size (`firmas-bookcase`) | 14x11, 11x14, 8.5x11, 11x8.5, 8x8, 10x10 (pulgadas) | 11x14 |
| Color | swatch (`fabric-standard`, 15) | ver [Paleta Standard](#paleta-fabric-standard-15-colores) | Verde militar |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| Título en portada y lomo (opcional) | text | — (texto libre) | — |

- **Cantidad:** dropdown.

---

## 5. Memory Box — `memory-box`

> Cajas hechas a mano para guardar fotos impresas. **Envío: 10-15 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Vinipiel | Vinipiel |
| Tamaño | size (`memory`) | 7x5, 5x7, 5x4, 4x5 (pulgadas) | 5x4 |
| Color | swatch (`fabric-standard`, 15) | ver [Paleta Standard](#paleta-fabric-standard-15-colores) | Verde militar |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| Título en portada | text | — (texto libre) | — |
| Fotos impresas del tamaño de la caja (opcional) | stepper | mínimo 0 | 1 |

- **Cantidad:** dropdown.

---

## 6. Fotos Impresas — `fotos-impresas`

> Impresión en papel fotográfico profesional. **Precio: 3400.00. Envío: 5 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Tamaño | size (`fotos`) | 5x7, 8x10, 10x14, 11x14, 12x16, 20x20, 30x30, 30x45 | 8x10 |
| Link de fotos (opcional) | url | URL (solo Google Drive o WeTransfer) | — |

- **Cantidad:** stepper, **mínimo 25 fotos**.

---

## 7. Cajas Personalizadas — `cajas-personalizadas`

> Cajas a mano para entregables, certificados, portafolios, etc. **Envío: 20 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Tela Plastificada, Papel Texturizado | Papel Texturizado |
| Tamaño | size (`cajas`) | 11x17, 8.5x11, 17x11, 11x8.5 (pulgadas) | 11x8.5 |
| Color | swatch (`fabric-carpetas`, 14) | ver [Paleta Carpetas](#paleta-fabric-carpetas-14-colores) | Blanco crema |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| Medidas de herraje | dropdown | Sin Herraje, 1 Pulgada, 1.5 Pulgadas, 2 Pulgadas | — |
| Espacio para USB | radio | Sí, No | No |
| ¿Cuentas con placa de logotipo? | radio | Sí, No | Sí |
| Agrega tu logotipo (opcional) | url | Link al logotipo en PDF o PNG | — |

- **Cantidad:** dropdown ("Cantidad de cajas"). *A partir de 21 cajas o más, cotización personalizada.*

---

## 8. Porta Planos — `porta-planos`

> Portaplanos para transportar planos/láminas de gran formato (60 × 90 cm). **Envío: 15 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Tela Plastificada, Papel Texturizado | Papel Texturizado |
| Color | swatch (`fabric-carpetas`, 14) | ver [Paleta Carpetas](#paleta-fabric-carpetas-14-colores) | Blanco crema |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| ¿Cuentas con placa de logotipo? | radio | Sí, No | No |
| Agrega tu logotipo (opcional) | url | Link al logotipo en PDF | — |

- **Cantidad:** dropdown ("Cantidad de portaplanos"). *A partir de 21 o más, cotización personalizada.*
- *Nota: este producto no tiene selector de tamaño (medida fija 60 × 90 cm).*

---

## 9. Carpetas — `carpetas`

> Carpetas personalizadas para documentos y entregables. **Envío: 20 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Material | pills | Tela, Tela Plastificada, Papel Texturizado | Papel Texturizado |
| Tamaño | size (`carpetas`) | 17x11, 11x8.5, 11x17, 8.5x11 (pulgadas) | 11x8.5 |
| Color | swatch (`fabric-carpetas`, 14) | ver [Paleta Carpetas](#paleta-fabric-carpetas-14-colores) | Blanco crema |
| Hotstamping | swatch (`hotstamping`, 7) | ver [Paleta Hotstamping](#paleta-hotstamping-7) | Oro Rosa |
| Medidas de herraje | dropdown | Sin Herraje, 1 Pulgada, 1.5 Pulgadas, 2 Pulgadas | — |
| ¿Cuentas con placa de logotipo? | radio | Sí, No | Sí |
| Agrega tu logotipo (opcional) | url | Nombre o link al logotipo en PDF | — |

- **Cantidad:** dropdown ("Cantidad de carpetas"). *A partir de 21 o más, cotización personalizada.*

---

## 10. Certificado de Regalo / Giftcard — `certificado-de-regalo`

> Gift card física o digital, vigencia de 6 meses. **Envío físico: 5 días hábiles.**

**Campos personalizables (custom fields):**

| Campo | Tipo | Opciones | Default |
|-------|------|----------|---------|
| Elige el regalo perfecto | gift_type | A: Producto On Paper · B: Crédito / Saldo | Producto On Paper (A) |
| Producto (si elige A) | select | Photobook Tradicional, Photobook Layflat, Memory Box | — |
| Crédito / Saldo (si elige B) | text | Monto a regalar (texto libre) | — |
| Nombre de quien recibe el regalo | text | Para: (texto libre) | — |
| Nombre de quien regala | text | De: (texto libre) | — |
| Forma de entrega | radio | Digital, Entrega física | Entrega física |
| Nombre | text | texto libre | — |
| Teléfono | text | texto libre | — |
| Correo electrónico | text | texto libre | — |
| Dirección de envío | text | texto libre | — |

- **Cantidad:** oculta (no aplica). *Si la entrega es Digital, se envía un PDF al correo de compra.*

---

## Paletas de color (swatches)

Los nombres de color son los `value` que viajan al carrito. Hex indicado como placeholder visual en el theme.

### Paleta `fabric-standard` (15 colores)

Camel, Gris medio, Blanco, Cobre, Gris claro, Carbón, Crema, Terracota, Marino, Verde militar, Café, Chocolate, Vino, Azul, Negro

### Paleta `fabric-photobook` (30 colores)

Negro, Camel, Café claro, Gris oscuro, Azul marino, Terracota, Mostaza, Vino, Chocolate, Beige, Naranja, Azul petróleo, Gris verdoso, Blanco, Arena, Verde olivo, Gris claro, Negro mate, Crema, Vino oscuro, Gris, Azul grisáceo, Marino, Hueso, Piedra, Verde militar, Camel oscuro, Óxido, Topo, Verde bosque

### Paleta `fabric-carpetas` (14 colores)

Carbón, Blanco crema, Azul, Beige, Camel, Café, Gris oscuro, Gris claro, Verde, Negro, Gris perla, Vino, Marino, Verde bosque

### Paleta `hotstamping` (7)

Café, Negro, Plateado, Blanco, Cobre, Dorado, Oro Rosa

---

## Sets de tamaño (pulgadas)

| Set | Medidas |
|-----|---------|
| `photobook` | 14x11, 11x14, 10x10, 8.5x11, 11x8.5, 8x8 |
| `firmas-bookcase` | 14x11, 11x14, 8.5x11, 11x8.5, 8x8, 10x10 |
| `memory` | 7x5, 5x7, 5x4, 4x5 |
| `carpetas` | 17x11, 11x8.5, 11x17, 8.5x11 |
| `cajas` | 11x17, 8.5x11, 17x11, 11x8.5 |
| `fotos` | 5x7, 8x10, 10x14, 11x14, 12x16, 20x20, 30x30, 30x45 |
