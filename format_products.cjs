const fs = require('fs');

function mapCategory(name, categories) {
  const n = (name || '').toUpperCase();
  if (n.includes('JAR') || n.includes('GHEE') || n.includes('HONEY') || n.includes('FUDKOR')) return { id: 'jars', name: 'Glass Jars & Storage' };
  if (n.includes('BOTTLE') || n.includes('MILK') || n.includes('WATER BOTTLE') || n.includes('SG ') || n.includes('GM ')) return { id: 'bottles', name: 'Milk & Water Bottles' };
  if (n.includes('WHISKY') || n.includes('WINE') || n.includes('CUP') || n.includes('MUG') || n.includes('GLASS') || n.includes('JUG') || n.includes('ICE CUBES') || n.includes('BEER') || n.includes('TUMBLER')) return { id: 'drinkware', name: 'Drinkware & Barware' };
  if (n.includes('DECANTER') || n.includes('AK47') || n.includes('AIRPLANE')) return { id: 'decanters', name: 'Luxury Decanter Sets' };
  if (n.includes('CAP') || n.includes('LUG') || n.includes('CLOSURE') || n.includes('SHAKER') || n.includes('LID')) return { id: 'caps', name: 'Lug & Plastic Caps' };
  if (n.includes('BOWL') || n.includes('PLATE') || n.includes('ASH TRAY') || n.includes('ASHTRAY') || n.includes('DISH') || n.includes('TRAY')) return { id: 'bowls', name: 'Bowls & Tableware' };
  return { id: 'jars', name: 'Glass Jars & Storage' };
}

function extractCapacity(name) {
  const m = name.match(/(\d+(?:\.\d+)?\s*(?:ML|KG|GMS|GM|LTR|L|INCH|PCS))/i);
  return m ? m[0] : 'Standard Trade Spec';
}

function extractMouthSize(name) {
  const m = name.match(/(\d+MM)/i);
  return m ? `${m[0]} Neck / Closure` : 'Standard Fit';
}

function extractTags(name) {
  const words = name.split(/\s+/).filter(w => w.length > 2 && !w.match(/^\d+$/));
  return Array.from(new Set(words)).slice(0, 5);
}

function processAll() {
  if (!fs.existsSync('all_brahmani_products.json')) {
    console.log('all_brahmani_products.json not found yet');
    return;
  }
  const raw = JSON.parse(fs.readFileSync('all_brahmani_products.json', 'utf8'));
  console.log(`Loaded ${raw.length} raw products from Brahmani!`);

  const processed = raw.map((p, idx) => {
    const cat = mapCategory(p.name, p.categories);
    return {
      id: p.id || `prod-${p.itemCode || idx}`,
      itemCode: p.itemCode || String(idx + 1000),
      aliasName: p.aliasName || null,
      name: p.name || 'Glassware Item',
      category: cat.id,
      categoryName: cat.name,
      price: typeof p.price === 'number' ? p.price : (Number(p.price) || 0),
      piecesPerCarton: typeof p.piecesPerCarton === 'number' ? p.piecesPerCarton : (Number(p.piecesPerCarton) || 1),
      moqCartons: 1,
      image: p.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      description: `${p.name} - High-clarity commercial glassware for wholesale trade supply, packaged by the carton in Surat warehouse.`,
      capacity: extractCapacity(p.name),
      mouthSize: extractMouthSize(p.name),
      material: 'Clear Soda Lime Flint Glass',
      inStock: p.stockStatus === 'in_stock' || !p.stockStatus || p.stockStatus !== 'out_of_stock',
      featured: idx < 12,
      tags: extractTags(p.name)
    };
  });

  const jsContent = `export const INITIAL_PRODUCTS = ${JSON.stringify(processed, null, 2)};\n`;
  fs.writeFileSync('src/data/products.js', jsContent, 'utf8');
  console.log(`✅ Successfully updated src/data/products.js with ${processed.length} products!`);
}

processAll();
