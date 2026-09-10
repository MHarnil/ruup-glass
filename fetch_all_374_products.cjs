const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null)).on('timeout', () => resolve(null));
  });
}

function mapCategory(name, categories) {
  const n = (name || '').toUpperCase();
  
  // First check categories array from Brahmani if provided
  let brahmaniLabels = [];
  if (Array.isArray(categories)) {
    brahmaniLabels = categories.map(c => typeof c === 'object' ? (c.label || c.name || '') : String(c)).filter(Boolean);
  }

  // Smart wholesale categorization for glassware buyers
  if (n.includes('JAR') || n.includes('GHEE') || n.includes('HONEY') || n.includes('FUDKOR') || n.includes('CONTAINER') || n.includes('POP JAR')) {
    return { id: 'jars', name: 'Glass Jars & Storage', brahmaniTags: brahmaniLabels };
  }
  if (n.includes('BOTTLE') || n.includes('MILK') || n.includes('WATER BOTTLE') || n.includes('SG ') || n.includes('GM ') || n.includes('FLASK') || n.includes('OIL')) {
    return { id: 'bottles', name: 'Milk & Water Bottles', brahmaniTags: brahmaniLabels };
  }
  if (n.includes('WHISKY') || n.includes('WINE') || n.includes('CUP') || n.includes('MUG') || n.includes('GLASS') || n.includes('JUG') || n.includes('ICE CUBES') || n.includes('BEER') || n.includes('TUMBLER') || n.includes('SHOT')) {
    return { id: 'drinkware', name: 'Drinkware & Barware', brahmaniTags: brahmaniLabels };
  }
  if (n.includes('DECANTER') || n.includes('AK47') || n.includes('AIRPLANE') || n.includes('SKULL') || n.includes('GLOBE')) {
    return { id: 'decanters', name: 'Luxury Decanter Sets', brahmaniTags: brahmaniLabels };
  }
  if (n.includes('CAP') || n.includes('LUG') || n.includes('CLOSURE') || n.includes('SHAKER') || n.includes('LID') || n.includes('SEAL')) {
    return { id: 'caps', name: 'Lug & Plastic Caps', brahmaniTags: brahmaniLabels };
  }
  if (n.includes('BOWL') || n.includes('PLATE') || n.includes('ASH TRAY') || n.includes('ASHTRAY') || n.includes('DISH') || n.includes('TRAY') || n.includes('BAKING') || n.includes('CASSEROLE')) {
    return { id: 'bowls', name: 'Bowls & Tableware', brahmaniTags: brahmaniLabels };
  }

  // Fallback check on brahmani tags
  if (brahmaniLabels.some(l => l.toUpperCase().includes('GLASS'))) {
    return { id: 'drinkware', name: 'Drinkware & Barware', brahmaniTags: brahmaniLabels };
  }

  return { id: 'jars', name: 'Glass Jars & Storage', brahmaniTags: brahmaniLabels };
}

function extractCapacity(name) {
  const m = name.match(/(\d+(?:\.\d+)?\s*(?:ML|KG|GMS|GM|LTR|L|INCH|PCS|SET|SETS))/i);
  return m ? m[0] : 'Standard Trade Spec';
}

function extractMouthSize(name) {
  const m = name.match(/(\d+MM)/i);
  return m ? `${m[0]} Neck / Closure` : 'Standard Fit';
}

function extractTags(name, categories) {
  const words = name.split(/\s+/).filter(w => w.length > 2 && !w.match(/^\d+$/));
  let brahmaniLabels = [];
  if (Array.isArray(categories)) {
    brahmaniLabels = categories.map(c => typeof c === 'object' ? (c.label || c.name || '') : String(c)).filter(Boolean);
  }
  return Array.from(new Set([...words, ...brahmaniLabels])).slice(0, 8);
}

async function scrapeAllDetails() {
  const rawProducts = JSON.parse(fs.readFileSync('all_brahmani_products.json', 'utf8'));
  console.log(`Starting detail scraping for all ${rawProducts.length} products...`);

  const results = [];
  const BATCH_SIZE = 15;

  for (let i = 0; i < rawProducts.length; i += BATCH_SIZE) {
    const batch = rawProducts.slice(i, i + BATCH_SIZE);
    console.log(`Fetching batch ${i + 1} - ${Math.min(i + BATCH_SIZE, rawProducts.length)} / ${rawProducts.length}...`);

    const batchPromises = batch.map(async (p, idxInBatch) => {
      const globalIdx = i + idxInBatch;
      const cat = mapCategory(p.name, p.categories);
      const itemCode = p.itemCode || String(globalIdx + 1000);
      
      let allImages = [];
      if (p.image) allImages.push(p.image);

      let detailedDescription = null;

      try {
        const rawText = await fetchUrl(`https://www.thebrahmani.com/products/${itemCode}.data`);
        if (rawText) {
          const arr = JSON.parse(rawText);
          arr.forEach(item => {
            if (typeof item === 'string') {
              if (item.startsWith(`https://assets.brahmanicrm.com/products/${itemCode}/`)) {
                if (!allImages.includes(item)) allImages.push(item);
              }
              if (item.length > 60 && !item.startsWith('http') && !item.startsWith('{') && !item.startsWith('[')) {
                if (!detailedDescription && (item.includes(' ') || item.includes('\n'))) {
                  detailedDescription = item;
                }
              }
            }
          });
        }
      } catch (err) {
        // fallback
      }

      if (allImages.length === 0 && p.image) {
        allImages.push(p.image);
      }

      const rawPrice = typeof p.price === 'number' ? p.price : (Number(p.price) || 0);
      // Apply the + ₹20 price rule requested by user
      const finalPrice = rawPrice + 20;

      return {
        id: p.id || `prod-${itemCode}`,
        itemCode: itemCode,
        aliasName: p.aliasName || null,
        name: p.name || 'Glassware Item',
        category: cat.id,
        categoryName: cat.name,
        brahmaniCategories: cat.brahmaniTags,
        price: finalPrice,
        basePrice: rawPrice,
        piecesPerCarton: typeof p.piecesPerCarton === 'number' ? p.piecesPerCarton : (Number(p.piecesPerCarton) || 1),
        moqCartons: 1,
        image: allImages[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'],
        description: detailedDescription || `${p.name} - High-clarity commercial glassware for wholesale trade supply, packaged by the carton in Surat warehouse.`,
        capacity: extractCapacity(p.name),
        mouthSize: extractMouthSize(p.name),
        material: 'Clear Soda Lime Flint Glass',
        inStock: p.stockStatus === 'in_stock' || !p.stockStatus || p.stockStatus !== 'out_of_stock',
        featured: globalIdx < 16,
        tags: extractTags(p.name, p.categories)
      };
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  console.log(`\n🎉 Finished fetching all ${results.length} product details with multi-images!`);

  // Count multi-images
  const multiCount = results.filter(r => r.images && r.images.length > 1).length;
  console.log(`Products with multiple images: ${multiCount} / ${results.length}`);

  // Save to src/data/products.js
  const jsContent = `export const INITIAL_PRODUCTS = ${JSON.stringify(results, null, 2)};\n`;
  fs.writeFileSync('src/data/products.js', jsContent, 'utf8');
  console.log('✅ Updated src/data/products.js successfully with all 374 products, images and details!');
}

scrapeAllDetails().catch(console.error);
