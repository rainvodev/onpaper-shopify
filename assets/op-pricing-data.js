/* On Paper — Configuración de precios por producto (line-item properties → recargos).
   ⚠️ DUMMY ESCALONADO (escala pesos MXN): valores coherentes para un taller artesanal, para que
   Anaissa vea el catálogo en acción. Reemplazar por los montos reales antes de producción.
   Los productos con variantes nativas (photobooks, bookcase, fotos, porta-planos) cobran por su
   variante de Shopify (op-variants.js); su config aquí queda como respaldo/consistencia.
   Keyed por handle. Montos en PESOS.

   Reglas: { map:{valor:recargo} } · { perUnit:monto } · { nonEmpty:monto }
   Modos:  'sum' (base+Σ) · 'unit_qty' (unitario×cantidad) · 'amount' (monto del cliente) */
window.OP_PRICING = {

  'photobook-tradicional': {
    base: 1990,
    rules: {
      'Tamaño': { map: { '14x11':500, '11x14':500, '10x10':300, '8.5x11':200, '11x8.5':200, '8x8':0 } },
      // 'Ventana de foto en portada' → opción sin costo (confirmado Anaissa 8-jul-2026)
      'Diseño interior': { map: { 'Minimalista':550, 'Tradicional':0 } },
      'Número de fotos': { map: { '0-150 fotos':0, '151-250 fotos':400, '251-350 fotos':800 } }
    }
  },

  'photobook-layflat': {
    base: 2490,
    rules: {
      'Tamaño': { map: { '14x11':600, '11x14':600, '10x10':400, '8.5x11':300, '11x8.5':300, '8x8':0 } },
      // 'Ventana de foto en portada' → opción sin costo (confirmado Anaissa 8-jul-2026)
      'Número de fotos y páginas': { map: {
        '0-50 fotos (20-30 páginas)':0, '0-100 fotos (30-40 páginas)':400,
        '0-150 fotos (60-70 páginas)':800, '0-200 fotos (80-90 páginas)':1200, '0-250 fotos (100 páginas)':1600
      } }
    }
  },

  'libro-de-firmas': {
    base: 1490,
    rules: {
      'Tamaño': { map: { '8x8':0, '10x10':250, '8.5x11':150, '11x8.5':150, '11x14':400, '14x11':400 } },
      'Tipo de hojas': { map: { 'Hojas en Blanco':0, 'Nombres Impresos':250, 'Nombres Rotulados':500 } },
      'Cantidad de hojas': { perUnit: 40 },
      'Agregar más nombres (opcional)': { nonEmpty: 150 }
    }
  },

  'bookcase': {
    base: 990,
    rules: {
      'Material': { map: { 'Tela':0, 'Vinipiel':300 } },
      'Tamaño': { map: { '8x8':0, '10x10':250, '8.5x11':150, '11x8.5':150, '11x14':400, '14x11':400 } }
    }
  },

  'memory-box': {
    base: 690,
    rules: {
      'Material': { map: { 'Tela':0, 'Vinipiel':200 } },
      'Tamaño': { map: { '4x5':0, '5x4':0, '5x7':150, '7x5':150 } },
      'Fotos impresas del tamaño de la caja (opcional)': { perUnit: 18 }
    }
  },

  'fotos-impresas': {
    mode: 'unit_qty',
    unitProp: 'Tamaño',
    qtyName: 'quantity',
    rules: {
      'Tamaño': { map: { '5x7':15, '8x10':25, '10x14':40, '11x14':55, '12x16':80, '20x20':180, '30x30':350, '30x45':480 } }
    }
  },

  'cajas-personalizadas': {
    base: 650,
    rules: {
      'Material': { map: { 'Papel Texturizado':0, 'Tela Plastificada':150, 'Tela':300 } },
      'Tamaño': { map: { '11x8.5':0, '8.5x11':100, '17x11':300, '11x17':300 } },
      'Medidas de herraje': { map: { 'Sin Herraje':0, '1 Pulgada':120, '1.5 Pulgadas':160, '2 Pulgadas':200 } },
      'Espacio para USB': { map: { 'Sí':150, 'No':0 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí':250, 'No':0 } }
    }
  },

  'porta-planos': {
    base: 750,
    rules: {
      'Material': { map: { 'Papel Texturizado':0, 'Tela Plastificada':150, 'Tela':300 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí':250, 'No':0 } }
    }
  },

  'carpetas': {
    base: 550,
    rules: {
      'Material': { map: { 'Papel Texturizado':0, 'Tela Plastificada':150, 'Tela':300 } },
      'Tamaño': { map: { '11x8.5':0, '8.5x11':0, '17x11':200, '11x17':200 } },
      'Medidas de herraje': { map: { 'Sin Herraje':0, '1 Pulgada':120, '1.5 Pulgadas':160, '2 Pulgadas':200 } },
      '¿Cuentas con placa de logotipo?': { map: { 'Sí':250, 'No':0 } }
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
