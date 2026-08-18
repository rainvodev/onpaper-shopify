#!/usr/bin/env python3
"""Genera _import/products-variants.csv para On Paper.

Precios REALES del catálogo oficial (CATALOGO.pdf, ago-2026) para:
photobook-tradicional, photobook-layflat, bookcase, memory-box, fotos-impresas.
Precios DUMMY (marcados; pendientes de Anaissa) para:
libro-de-firmas, cajas-personalizadas, carpetas, porta-planos.

Valida: <=3 opciones, <=100 variantes por producto, matriz completa,
y que cada valor de opción exista textualmente en el template del producto
(o en el set correspondiente de snippets/op-sizes.liquid).
"""
import csv, io, json, re, sys, itertools, pathlib

ROOT = pathlib.Path('/home/user/onpaper-shopify')

# ---------------------------------------------------------------- helpers
def template_json(handle_suffix):
    txt = (ROOT / f'templates/product.{handle_suffix}.json').read_text()
    txt = re.sub(r'^\s*/\*.*?\*/\s*', '', txt, flags=re.S)
    return json.loads(txt)

def op_sizes_sets():
    liquid = (ROOT / 'snippets/op-sizes.liquid').read_text()
    sets = {}
    for m in re.finditer(r"when '([a-z-]+)'\s*\n\s*assign data = \"([^\"]+)\"", liquid):
        sets[m.group(1)] = m.group(2).split(',')
    return sets

SIZES = op_sizes_sets()

def block_options(tpl, block_id):
    b = tpl['sections']['main']['blocks'][block_id]
    s = b['settings']
    if b['type'] == 'size':
        return SIZES[s['set']]
    return [o.strip() for o in s['options'].split(',')]

# ---------------------------------------------------------------- pricing
BAND_TRAD = {('14x11','11x14','10x10'): [4750, 5200, 5700],
             ('8.5x11','11x8.5','8x8'): [4300, 4750, 5200]}
TIERS_TRAD = ['0-150 fotos', '151-250 fotos', '251-350 fotos']

BAND_LAY = {('14x11','11x14'): [5200, 6400, 7700, 9000, 9600],
            ('10x10','8.5x11','11x8.5'): [4300, 5200, 6000, 6900, 7300],
            ('8x8',): [3900, 4700, 5500, 6200, 6600]}
TIERS_LAY = ['0-50 fotos (20-30 páginas)', '0-100 fotos (30-40 páginas)',
             '0-150 fotos (60-70 páginas)', '0-200 fotos (80-90 páginas)',
             '0-250 fotos (100 páginas)']

BAND_BOOKCASE = {('14x11','11x14','10x10'): 1950, ('8.5x11','11x8.5','8x8'): 1650}

FOTOS_PRICE = {'4x5': 8, '5x7': 12, '8x10': 40, '10x14': 75, '11x14': 90,
               '12x16': 115, '20x20': 290, '30x30': 720, '30x45': 1080}

MEMORY_BASE = {'4x5': 750, '5x7': 1100}
MEMORY_FOTO_TIERS = {'Sin fotos': 0, '10 fotos': 10, '20 fotos': 20, '30 fotos': 30}

# DUMMY (escala coherente; reemplazar con montos reales de Anaissa)
FIRMAS_BASE = 1490
FIRMAS_TAM = {'14x11': 400, '11x14': 400, '8.5x11': 150, '11x8.5': 150, '8x8': 0, '10x10': 250}
FIRMAS_TIPO = {'Hojas en Blanco': 0, 'Nombres Impresos': 250, 'Nombres Rotulados': 500}
FIRMAS_CANT = {'Hasta 20 hojas': 800, 'Hasta 30 hojas': 1200, 'Hasta 40 hojas': 1600, 'Hasta 50 hojas': 2000}

MAT3 = {'Tela': 300, 'Tela Plastificada': 150, 'Papel Texturizado': 0}
HERRAJE = {'Sin Herraje': 0, '1 Pulgada': 120, '1.5 Pulgadas': 160, '2 Pulgadas': 200}
CAJAS_BASE, CAJAS_TAM = 650, {'11x17': 300, '8.5x11': 100, '17x11': 300, '11x8.5': 0}
CARP_BASE, CARP_TAM = 550, {'17x11': 200, '11x8.5': 0, '11x17': 200, '8.5x11': 0}
PORTA_BASE, PLACA = 750, {'Sí': 250, 'No': 0}

def band_price(bands, size):
    for sizes, price in bands.items():
        if size in sizes:
            return price
    raise KeyError(size)

# ---------------------------------------------------------------- productos
PRODUCTS = []

def add(handle, title, body, ptype, tags, status, options, pricer):
    """options: list of (name, [values]); pricer(dict valores)->precio."""
    combos = list(itertools.product(*[v for _, v in options]))
    assert len(options) <= 3, f'{handle}: >3 opciones'
    assert len(combos) <= 100, f'{handle}: {len(combos)} variantes (>100)'
    PRODUCTS.append(dict(handle=handle, title=title, body=body, ptype=ptype,
                         tags=tags, status=status, options=options,
                         rows=[(c, pricer(dict(zip([n for n, _ in options], c)))) for c in combos]))

tpl = template_json('photobook-tradicional')
add('photobook-tradicional', 'Photobook Tradicional',
    '<p>Photobook tradicional para guardar tus recuerdos más bonitos. Personalízalo a tu gusto.</p>',
    'Photobooks', 'photobook,recuerdos', 'active',
    [('Tamaño', block_options(tpl, 'size')), ('Número de fotos', block_options(tpl, 'fotos'))],
    lambda v: band_price(BAND_TRAD, v['Tamaño'])[TIERS_TRAD.index(v['Número de fotos'])])

tpl = template_json('photobook-layflat')
add('photobook-layflat', 'Photobook Layflat',
    '<p>Photobook layflat de páginas continuas para una experiencia visual sin cortes.</p>',
    'Photobooks', 'photobook,layflat,recuerdos', 'active',
    [('Tamaño', block_options(tpl, 'size')), ('Número de fotos y páginas', block_options(tpl, 'fotos'))],
    lambda v: band_price(BAND_LAY, v['Tamaño'])[TIERS_LAY.index(v['Número de fotos y páginas'])])

tpl = template_json('bookcase')
add('bookcase', 'Bookcase',
    '<p>Estuche/caja para proteger y presentar tu photobook.</p>',
    'Cajas', 'bookcase,estuche', 'active',
    [('Tamaño', block_options(tpl, 'size'))],
    lambda v: band_price(BAND_BOOKCASE, v['Tamaño']))

tpl = template_json('memory-box')
add('memory-box', 'Memory Box',
    '<p>Caja de recuerdos para guardar tus momentos especiales.</p>',
    'Cajas', 'memory-box,recuerdos', 'active',
    [('Tamaño', block_options(tpl, 'size')),
     ('Fotos impresas del tamaño de la caja (opcional)', block_options(tpl, 'fotos'))],
    lambda v: MEMORY_BASE[v['Tamaño']] + MEMORY_FOTO_TIERS[v['Fotos impresas del tamaño de la caja (opcional)']] * FOTOS_PRICE[v['Tamaño']])

tpl = template_json('fotos-impresas')
add('fotos-impresas', 'Fotos Impresas',
    '<p>Impresión de fotografías con acabado premium.</p>',
    'Impresiones', 'fotos,impresiones', 'active',
    [('Tamaño', block_options(tpl, 'size'))],
    lambda v: FOTOS_PRICE[v['Tamaño']])

# --- DUMMY: en draft hasta tener precios reales de Anaissa ---
tpl = template_json('libro-de-firmas')
add('libro-de-firmas', 'Libro de Firmas',
    '<p>Libro de firmas para tu evento; un recuerdo de las personas que te acompañaron.</p>',
    'Libros', 'libro-de-firmas,bodas,eventos', 'draft',
    [('Tamaño', block_options(tpl, 'size')), ('Tipo de hojas', block_options(tpl, 'hojas')),
     ('Cantidad de hojas', block_options(tpl, 'cant_hojas'))],
    lambda v: FIRMAS_BASE + FIRMAS_TAM[v['Tamaño']] + FIRMAS_TIPO[v['Tipo de hojas']] + FIRMAS_CANT[v['Cantidad de hojas']])

tpl = template_json('cajas-personalizadas')
add('cajas-personalizadas', 'Cajas Personalizadas',
    '<p>Cajas personalizadas para regalar o guardar tus recuerdos.</p>',
    'Cajas', 'cajas,personalizado', 'draft',
    [('Material', block_options(tpl, 'material')), ('Tamaño', block_options(tpl, 'size')),
     ('Medidas de herraje', block_options(tpl, 'herraje'))],
    lambda v: CAJAS_BASE + MAT3[v['Material']] + CAJAS_TAM[v['Tamaño']] + HERRAJE[v['Medidas de herraje']])

tpl = template_json('carpetas')
add('carpetas', 'Carpetas',
    '<p>Carpetas para organizar y presentar documentos y recuerdos.</p>',
    'Accesorios', 'carpetas,papeleria', 'draft',
    [('Material', block_options(tpl, 'material')), ('Tamaño', block_options(tpl, 'size')),
     ('Medidas de herraje', block_options(tpl, 'herraje'))],
    lambda v: CARP_BASE + MAT3[v['Material']] + CARP_TAM[v['Tamaño']] + HERRAJE[v['Medidas de herraje']])

tpl = template_json('porta-planos')
add('porta-planos', 'Porta Planos',
    '<p>Porta planos / tubo para transportar y guardar impresiones y posters.</p>',
    'Accesorios', 'porta-planos,accesorios', 'draft',
    [('Material', block_options(tpl, 'material')),
     ('¿Cuentas con placa de logotipo?', block_options(tpl, 'placa'))],
    lambda v: PORTA_BASE + MAT3[v['Material']] + PLACA[v['¿Cuentas con placa de logotipo?']])

# ---------------------------------------------------------------- emitir CSV
HEADER = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
          'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
          'Option3 Name', 'Option3 Value', 'Variant Inventory Policy',
          'Variant Fulfillment Service', 'Variant Price', 'Variant Requires Shipping',
          'Variant Taxable', 'Status']

buf = io.StringIO()
w = csv.writer(buf, quoting=csv.QUOTE_ALL, lineterminator='\n')
w.writerow(HEADER)
total = 0
for p in PRODUCTS:
    names = [n for n, _ in p['options']] + ['', '']
    published = 'TRUE' if p['status'] == 'active' else 'FALSE'
    for i, (combo, price) in enumerate(p['rows']):
        vals = list(combo) + ['', '']
        first = i == 0
        w.writerow([
            p['handle'],
            p['title'] if first else '',
            p['body'] if first else '',
            'On Paper' if first else '',
            p['ptype'] if first else '',
            p['tags'] if first else '',
            published if first else '',
            names[0] if first else '', vals[0],
            names[1] if first else '', vals[1],
            names[2] if first else '', vals[2],
            'deny', 'manual', f'{price:.2f}', 'TRUE', 'TRUE',
            p['status'] if first else '',
        ])
        total += 1
    print(f"{p['handle']:24s} {len(p['rows']):3d} variantes  [{p['status']}]"
          f"  {min(pr for _, pr in p['rows'])}–{max(pr for _, pr in p['rows'])} MXN")

out = ROOT / '_import/products-variants.csv'
out.write_text(buf.getvalue())
print(f'\nTotal: {total} filas de variantes → {out}')

# ---------------------------------------------------------------- spot-checks del catálogo
def price_of(handle, **opts):
    for p in PRODUCTS:
        if p['handle'] == handle:
            for combo, price in p['rows']:
                if dict(zip([n for n, _ in p['options']], combo)) == opts:
                    return price
    raise KeyError((handle, opts))

assert price_of('photobook-tradicional', **{'Tamaño': '11x14', 'Número de fotos': '0-150 fotos'}) == 4750
assert price_of('photobook-tradicional', **{'Tamaño': '8x8', 'Número de fotos': '251-350 fotos'}) == 5200
assert price_of('photobook-layflat', **{'Tamaño': '14x11', 'Número de fotos y páginas': '0-250 fotos (100 páginas)'}) == 9600
assert price_of('photobook-layflat', **{'Tamaño': '8x8', 'Número de fotos y páginas': '0-50 fotos (20-30 páginas)'}) == 3900
assert price_of('bookcase', **{'Tamaño': '10x10'}) == 1950
assert price_of('bookcase', **{'Tamaño': '8x8'}) == 1650
assert price_of('memory-box', **{'Tamaño': '4x5', 'Fotos impresas del tamaño de la caja (opcional)': 'Sin fotos'}) == 750
assert price_of('memory-box', **{'Tamaño': '5x7', 'Fotos impresas del tamaño de la caja (opcional)': '30 fotos'}) == 1460
assert price_of('fotos-impresas', **{'Tamaño': '30x45'}) == 1080
assert price_of('fotos-impresas', **{'Tamaño': '4x5'}) == 8
print('Spot-checks del catálogo: OK')
