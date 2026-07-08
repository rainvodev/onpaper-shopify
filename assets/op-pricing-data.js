/* On Paper — Configuración de precios por producto (line-item properties → recargos).
   ⚠️ DUMMY DE DEMO: todo en 10 pesos para ver la tienda funcionando. Base = 10; cada opción
   que cambia el precio suma +10; la opción por defecto/base suma 0 (para que se note el cambio).
   Reemplazar por los montos reales de Anaissa antes de producción. Keyed por handle. En PESOS (MXN).

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
    base: 10,
    rules: {
      'Tamaño': { map: { '14x11': 0, '11x14': 0, '10x10': 0, '8.5x11': 10, '11x8.5': 10, '8x8': 10 } },
      // 'Ventana de foto en portada' → opción sin costo (incluida en el precio · confirmado Anaissa 8-jul-2026)
      'Diseño interior': { map: { 'Minimalista': 10, 'Tradicional': 0 } },
      'Número de fotos': { map: { '0-150 fotos': 0, '151-250 fotos': 10, '251-350 fotos': 10 } }
    }
  },

  'photobook-layflat': {
    base: 10,
    rules: {
      'Tamaño': { map: { '14x11': 0, '11x14': 0, '10x10': 10, '8.5x11': 10, '11x8.5': 10, '8x8': 10 } },
      // 'Ventana de foto en portada' → opción sin costo (incluida en el precio · confirmado Anaissa 8-jul-2026)
      'Título en lomo (opcional)': { nonEmpty: 10 },
      'Número de fotos y páginas': { map: {
        '0-50 fotos (20-30 páginas)': 0,
        '0-100 fotos (30-40 páginas)': 10,
        '0-150 fotos (60-70 páginas)': 10,
        '0-200 fotos (80-90 páginas)': 10,
        '0-250 fotos (100 páginas)': 10
      } }
    }
  },

  'libro-de-firmas': {
    base: 10,
    rules: {
      'Tamaño': { map: { '8x8': 0, '10x10': 10, '8.5x11': 10, '11x8.5': 10, '11x14': 10, '14x11': 10 } },
      'Tipo de hojas': { map: { 'Hojas en Blanco': 0, 'Nombres Impresos': 10, 'Nombres Rotulados': 10 } },
      'Cantidad de hojas': { perUnit: 10 },
      'Agregar más nombres (opcional)': { nonEmpty: 10 }
    }
  },

  'bookcase': {
    base: 10,
    rules: {
      'Material': { map: { 'Tela': 0, 'Vinipiel': 10 } },
      'Tamaño': { map: { '8x8': 0, '10x10': 10, '8.5x11': 10, '11x8.5': 10, '11x14': 10, '14x11': 10 } }
    }
  },

  'memory-box': {
    base: 10,
    rules: {
      'Material': { map: { 'Tela': 0, 'Vinipiel': 10 } },
      'Tamaño': { map: { '4x5': 0, '5x4': 0, '5x7': 10, '7x5': 10 } },
      'Fotos impresas del tamaño de la caja (opcional)': { perUnit: 10 }
    }
  },

  'fotos-impresas': {
    mode: 'unit_qty',
    unitProp: 'Tamaño',
    qtyName: 'quantity',
    rules: {
      'Tamaño': { map: {
        '5x7': 10, '8x10': 10, '10x14': 10, '11x14': 10,
        '12x16': 10, '20x20': 10, '30x30': 10, '30x45': 10
      } }
    }
  },

  'cajas-personalizadas': {
    base: 10,
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 10, 'Tela': 10 } },
      'Tamaño': { map: { '11x8.5': 0, '8.5x11': 0, '17x11': 10, '11x17': 10 } },
      'Medidas de herraje': { map: { 'Sin Herraje': 0, '1 Pulgada': 10, '1.5 Pulgadas': 10, '2 Pulgadas': 10 } },
      'Espacio para USB': { map: { 'Sí': 10, 'No': 0 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 10, 'No': 0 } }
    }
  },

  'porta-planos': {
    base: 10,
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 10, 'Tela': 10 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 10, 'No': 0 } }
    }
  },

  'carpetas': {
    base: 10,
    rules: {
      'Material': { map: { 'Papel Texturizado': 0, 'Tela Plastificada': 10, 'Tela': 10 } },
      'Tamaño': { map: { '11x8.5': 0, '8.5x11': 0, '17x11': 10, '11x17': 10 } },
      'Medidas de herraje': { map: { 'Sin Herraje': 0, '1 Pulgada': 10, '1.5 Pulgadas': 10, '2 Pulgadas': 10 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí': 10, 'No': 0 } }
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
