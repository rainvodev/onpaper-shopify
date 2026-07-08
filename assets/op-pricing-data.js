/* On Paper — Configuración de precios por producto (line-item properties → recargos).
   ⚠️ MONTOS DUMMY: placeholders para modelar/probar la lógica. Fuente: docs/precios-spec.md.
   Reemplazar por los montos reales de Anaissa antes de producción.
   Keyed por handle de producto. Todos los montos en PESOS (MXN), enteros o decimales.

   Tipos de regla:
     { map: { <valor>: recargo } }  → suma el recargo del valor seleccionado
     { perUnit: <monto> }           → suma monto × (número escrito en ese campo)
     { nonEmpty: <monto> }          → suma monto si el campo de texto tiene contenido
   Modos de producto:
     (default) 'sum'  → base + Σ recargos
     'unit_qty'       → (precio unitario según unitProp) × cantidad
     'amount'         → precio = monto escrito por el cliente (giftcard) */
window.OP_PRICING = {

  'photobook-tradicional': {
    base: 1990, // dummy
    rules: {
      'Tamaño': { map: { '14x11': 0, '11x14': 0, '10x10': 0, '8.5x11': 400, '11x8.5': 400, '8x8': 400 } }, // dummy (8.5x11 asumido)
      'Ventana de foto en portada': { map: { 'Sí': 200, 'No': 0 } }, // confirmado
      'Diseño interior': { map: { 'Minimalista': 550, 'Tradicional': 0 } }, // confirmado
      'Número de fotos': { map: { '0-150 fotos': 0, '151-250 fotos': 400, '251-350 fotos': 800 } } // dummy
    }
  },

  'photobook-layflat': {
    base: 2490, // real (CSV)
    rules: {
      'Tamaño': { map: { '14x11': 0, '11x14': 0, '10x10': 300, '8.5x11': 300, '11x8.5': 300, '8x8': 500 } }, // dummy
      'Ventana de foto en portada': { map: { 'Sí': 200, 'No': 0 } }, // confirmado
      'Título en lomo (opcional)': { nonEmpty: 200 }, // confirmado (+$200 si lleva título en lomo)
      'Número de fotos y páginas': { map: {
        '0-50 fotos (20-30 páginas)': 0,
        '0-100 fotos (30-40 páginas)': 300,
        '0-150 fotos (60-70 páginas)': 600,
        '0-200 fotos (80-90 páginas)': 900,
        '0-250 fotos (100 páginas)': 1200
      } } // dummy
    }
  },

  'libro-de-firmas': {
    base: 1490, // dummy
    rules: {
      'Tamaño': { map: { '8x8': 0, '10x10': 300, '8.5x11': 300, '11x8.5': 600, '11x14': 600, '14x11': 900 } }, // dummy
      'Tipo de hojas': { map: { 'Hojas en Blanco': 0, 'Nombres Impresos': 250, 'Nombres Rotulados': 500 } }, // dummy
      'Cantidad de hojas': { perUnit: 50 }, // dummy (+$50 por hoja)
      'Agregar más nombres (opcional)': { nonEmpty: 150 } // dummy
    }
  },

  'bookcase': {
    base: 3400, // real (CSV)
    rules: {
      'Material': { map: { 'Tela': 0, 'Vinipiel': 300 } }, // dummy
      'Tamaño': { map: { '8x8': 0, '10x10': 300, '8.5x11': 300, '11x8.5': 600, '11x14': 600, '14x11': 900 } } // dummy
    }
  },

  'memory-box': {
    base: 890, // dummy
    rules: {
      'Material': { map: { 'Tela': 0, 'Vinipiel': 200 } }, // dummy
      'Tamaño': { map: { '4x5': 0, '5x4': 0, '5x7': 150, '7x5': 150 } }, // dummy
      'Fotos impresas del tamaño de la caja (opcional)': { perUnit: 15 } // dummy (+$15 por foto)
    }
  },

  'fotos-impresas': {
    mode: 'unit_qty',
    unitProp: 'Tamaño',
    qtyName: 'quantity',
    rules: {
      'Tamaño': { map: { // dummy: precio unitario por foto según tamaño
        '5x7': 12, '8x10': 20, '10x14': 35, '11x14': 45,
        '12x16': 60, '20x20': 120, '30x30': 250, '30x45': 380
      } }
    }
  },

  'cajas-personalizadas': {
    base: 650, // dummy
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 150, 'Tela': 300 } }, // dummy
      'Tamaño': { map: { '11x8.5': 0, '8.5x11': 0, '17x11': 200, '11x17': 200 } }, // dummy
      'Medidas de herraje': { map: { 'Sin Herraje': 0, '1 Pulgada': 120, '1.5 Pulgadas': 160, '2 Pulgadas': 200 } }, // dummy
      'Espacio para USB': { map: { 'Sí': 150, 'No': 0 } }, // dummy
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 250, 'No': 0 } } // dummy
    }
  },

  'porta-planos': {
    base: 750, // dummy
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 150, 'Tela': 300 } }, // dummy
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 250, 'No': 0 } } // dummy
    }
  },

  'carpetas': {
    base: 550, // dummy
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 150, 'Tela': 300 } }, // dummy
      'Tamaño': { map: { '11x8.5': 0, '8.5x11': 0, '17x11': 200, '11x17': 200 } }, // dummy
      'Medidas de herraje': { map: { 'Sin Herraje': 0, '1 Pulgada': 120, '1.5 Pulgadas': 160, '2 Pulgadas': 200 } }, // dummy
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 250, 'No': 0 } } // dummy
    }
  },

  'certificado-de-regalo': {
    mode: 'amount',
    giftProp: 'Elige el regalo perfecto',
    optionB: 'Crédito / Saldo',
    amountProp: 'Crédito / Saldo',
    noteA: 'Según el producto seleccionado'
  }

};
