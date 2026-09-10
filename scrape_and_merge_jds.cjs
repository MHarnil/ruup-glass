const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }, 
      timeout: 12000 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    req.on('error', (err) => resolve({ statusCode: 500, error: err.message, data: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 408, error: 'Timeout', data: '' });
    });
  });
}

function parsePcsPerCarton(str, name, desc) {
  const target = `${str || ''} ${desc || ''} ${name || ''}`;
  const m = target.match(/(\d+)\s*(?:PCS|PC|SET|SETS|CTN|BOX|BXS|P)\b/i);
  if (m) {
    const val = parseInt(m[1], 10);
    if (val > 0 && val <= 5000) return val;
  }
  return 1;
}

function parseItemCodeAndAlias(skuRaw, name, url) {
  let itemCode = null;
  let aliasName = null;

  if (skuRaw) {
    const parts = skuRaw.split(/[|\/·-]/).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      itemCode = parts[0];
      aliasName = parts.slice(1).join(' - ');
    } else if (parts.length === 1) {
      itemCode = parts[0];
    }
  }

  if (!itemCode) {
    const urlMatch = url.match(/-(\d{4,6})-/);
    if (urlMatch) itemCode = urlMatch[1];
  }

  if (!itemCode) {
    const nameMatch = name.match(/\b(\d{4,6})\b/);
    if (nameMatch) itemCode = nameMatch[1];
  }

  return { itemCode: itemCode || `JDS-${Math.floor(1000 + Math.random() * 9000)}`, aliasName };
}

function mapCategory(name, jdsCat, subCat) {
  const n = `${name || ''} ${subCat || ''} ${jdsCat || ''}`.toUpperCase();
  if (n.includes('JAR') || n.includes('GHEE') || n.includes('HONEY') || n.includes('FUDKOR') || n.includes('CONTAINER') || n.includes('POP JAR') || n.includes('CANDY') || n.includes('CANISTER') || n.includes('SPICE')) {
    return { id: 'jars', name: 'Glass Jars & Storage' };
  }
  if (n.includes('BOTTLE') || n.includes('MILK') || n.includes('WATER BOTTLE') || n.includes('OIL BOTTLE') || n.includes('OIL CAN') || n.includes('SG ') || n.includes('GM ') || n.includes('FLASK') || n.includes('DISPENSER') || n.includes('SOAP')) {
    return { id: 'bottles', name: 'Milk & Water Bottles' };
  }
  if (n.includes('WHISKY') || n.includes('WINE') || n.includes('CUP') || n.includes('MUG') || n.includes('GLASS') || n.includes('JUG') || n.includes('ICE CUBES') || n.includes('BEER') || n.includes('TUMBLER') || n.includes('SHOT') || n.includes('DRINKWARE') || n.includes('TEA') || n.includes('STRAW') || n.includes('SIPPER') || n.includes('KETTLE') || n.includes('TEAPOT') || n.includes('VASE')) {
    return { id: 'drinkware', name: 'Drinkware & Barware' };
  }
  if (n.includes('DECANTER') || n.includes('AK47') || n.includes('AIRPLANE') || n.includes('SKULL') || n.includes('GLOBE')) {
    return { id: 'decanters', name: 'Luxury Decanter Sets' };
  }
  if (n.includes('CAP') || n.includes('LUG') || n.includes('CLOSURE') || n.includes('SHAKER') || n.includes('LID') || n.includes('SEAL')) {
    return { id: 'caps', name: 'Lug & Plastic Caps' };
  }
  if (n.includes('BOWL') || n.includes('PLATE') || n.includes('ASH TRAY') || n.includes('ASHTRAY') || n.includes('DISH') || n.includes('TRAY') || n.includes('BAKING') || n.includes('CASSEROLE') || n.includes('LUNCH BOX')) {
    return { id: 'bowls', name: 'Bowls & Tableware' };
  }
  return { id: 'jars', name: 'Glass Jars & Storage' };
}

function extractCapacity(name, desc) {
  const target = `${name || ''} ${desc || ''}`;
  const m = target.match(/(\d+(?:\.\d+)?\s*(?:ML|KG|GMS|GM|LTR|L|INCH|PCS|SET|SETS))\b/i);
  return m ? m[0] : 'Standard Trade Spec';
}

function extractMouthSize(name, desc) {
  const target = `${name || ''} ${desc || ''}`;
  const m = target.match(/(\d+MM)\b/i);
  return m ? `${m[0]} Neck / Fit` : 'Standard Fit';
}

function isGlasswareProduct(productObj, html) {
  const text = `${productObj.name || ''} ${productObj.category || ''} ${productObj.description || ''} ${html || ''}`.toUpperCase();
  
  // Exclude non-glassware items
  if (text.includes('LADDER') || text.includes('MOP') || text.includes('CLOTH') || text.includes('STEEL RACK') || text.includes('WOODEN CHAIR') || text.includes('STEP STOOL') || text.includes('PLASTIC BROOM')) {
    return false;
  }

  if (productObj.category && productObj.category.toLowerCase().includes('glassware')) {
    return true;
  }

  const glassKeywords = [
    'GLASS', 'JAR', 'BOTTLE', 'DECANTER', 'MUG', 'CUP', 'BOWL', 'TUMBLER', 
    'BOROSILICATE', 'FLINT', 'BEER', 'WHISKY', 'WINE', 'KETTLE', 'LUG', 
    'CANISTER', 'CRUET', 'ASHTRAY', 'DISH', 'GOBLET', 'CARAFE', 'SAUCER', 'JUG',
    'CANDY', 'TEAPOT', 'OIL', 'POP', 'STRAW', 'SIPPER', 'VASE', 'LUNCH BOX'
  ];

  return glassKeywords.some(kw => text.includes(kw));
}

async function scrapeAndMerge() {
  console.log('--- STARTING JDS ENTERPRISE GLASSWARE EXTRACTION ---');

  // 1. Load existing Ruup Glass products
  const existingContent = fs.readFileSync('src/data/products.js', 'utf8');
  const existingJsonStr = existingContent.replace('export const INITIAL_PRODUCTS = ', '').replace(/;\s*$/, '');
  const existingProducts = JSON.parse(existingJsonStr);
  console.log(`Current Ruup Glass products count: ${existingProducts.length}`);

  // Create fast duplicate lookup sets
  const existingCodes = new Set(existingProducts.map(p => String(p.itemCode).toLowerCase().trim()));
  const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

  // 2. Load JDS URLs
  const sitemapXml = fs.readFileSync('jds_sitemap.xml', 'utf8');
  const allUrls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapXml)) !== null) {
    if (match[1].includes('/products/')) {
      allUrls.push(match[1]);
    }
  }
  console.log(`Total JDS product URLs in sitemap: ${allUrls.length}`);

  // 3. Worker Pool Concurrency
  const CONCURRENCY = 8;
  const newGlasswareProducts = [];
  let processedCount = 0;
  let skippedDuplicates = 0;
  let skippedNonGlass = 0;
  let skippedFailed = 0;

  async function worker(urlList) {
    while (urlList.length > 0) {
      const url = urlList.shift();
      if (!url) break;

      try {
        const res = await fetchUrl(url);
        processedCount++;
        if (processedCount % 25 === 0 || processedCount === allUrls.length) {
          console.log(`Progress: ${processedCount}/${allUrls.length} processed | New Glassware Added: ${newGlasswareProducts.length}`);
        }

        if (res.statusCode !== 200 || !res.data) {
          skippedFailed++;
          continue;
        }

        const html = res.data;
        const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
        let productLd = null;

        for (const m of ldMatches) {
          try {
            const parsed = JSON.parse(m[1]);
            if (parsed['@type'] === 'Product') productLd = parsed;
          } catch (e) {}
        }

        if (!productLd || !productLd.name) {
          skippedFailed++;
          continue;
        }

        if (!isGlasswareProduct(productLd, html)) {
          skippedNonGlass++;
          continue;
        }

        const { itemCode, aliasName } = parseItemCodeAndAlias(productLd.sku, productLd.name, url);
        const cleanName = productLd.name.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Duplicate check against both existing Ruup Glass catalog and newly added items
        if (existingCodes.has(String(itemCode).toLowerCase().trim()) || existingNames.has(cleanName)) {
          skippedDuplicates++;
          continue;
        }

        // Extract specs from HTML
        const cartonMatch = html.match(/Carton Quantity<\/span>\s*<span[^>]*>(.*?)<\/span>/i) ||
                            html.match(/Packing<\/span>\s*<span[^>]*>(.*?)<\/span>/i) ||
                            html.match(/Wholesale rate\s*·\s*([^<\n]+)/i);
        const cartonStr = cartonMatch ? cartonMatch[1].trim() : '';

        const materialMatch = html.match(/Material<\/span>\s*<span[^>]*>(.*?)<\/span>/i);
        const materialStr = materialMatch ? materialMatch[1].trim() : 'Clear Flint Glass';

        const subCatMatch = html.match(/Sub-category<\/span>\s*<span[^>]*>(.*?)<\/span>/i);
        const subCatStr = subCatMatch ? subCatMatch[1].trim() : '';

        // Extract Images
        let images = [];
        if (Array.isArray(productLd.image)) {
          images = productLd.image;
        } else if (typeof productLd.image === 'string') {
          images = [productLd.image];
        }
        if (images.length === 0) {
          images = ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'];
        }

        // Base Price + 20 rule
        const rawPrice = Number(productLd.offers?.price) || 0;
        const finalPrice = rawPrice + 20;

        const cat = mapCategory(productLd.name, productLd.category, subCatStr);
        const pcsPerCarton = parsePcsPerCarton(cartonStr, productLd.name, productLd.description);

        const newItem = {
          id: `prod-${itemCode}`,
          itemCode: itemCode,
          aliasName: aliasName,
          name: productLd.name.replace(/\s+/g, ' ').trim(),
          category: cat.id,
          categoryName: cat.name,
          brahmaniCategories: [cat.name, subCatStr, 'JDS Enterprise'].filter(Boolean),
          price: finalPrice,
          basePrice: rawPrice,
          source: 'JDS Enterprise',
          piecesPerCarton: pcsPerCarton,
          moqCartons: 1,
          image: images[0],
          images: images,
          description: productLd.description ? productLd.description.replace(/\r/g, '').trim() : `${productLd.name} - Premium glassware supply with carton packing for wholesale trade dispatch.`,
          capacity: extractCapacity(productLd.name, productLd.description),
          mouthSize: extractMouthSize(productLd.name, productLd.description),
          material: materialStr.includes('Glass') ? materialStr : 'Clear Borosilicate / Soda-Lime Glass',
          inStock: productLd.offers?.availability?.includes('InStock') ?? true,
          featured: false,
          tags: [cat.name, subCatStr, 'JDS Glassware', 'Surat Wholesale'].filter(Boolean)
        };

        // Mark as seen
        existingCodes.add(String(itemCode).toLowerCase().trim());
        existingNames.add(cleanName);
        newGlasswareProducts.push(newItem);

      } catch (err) {
        skippedFailed++;
      }
    }
  }

  // Create queue and workers
  const urlQueue = [...allUrls];
  const workers = [];
  for (let w = 0; w < CONCURRENCY; w++) {
    workers.push(worker(urlQueue));
  }

  await Promise.all(workers);

  console.log(`\n========================================`);
  console.log(`📊 JDS SCRAPING SUMMARY:`);
  console.log(`Total URLs Processed: ${processedCount}`);
  console.log(`Skipped Non-Glassware: ${skippedNonGlass}`);
  console.log(`Skipped Duplicates (Already in Ruup Glass): ${skippedDuplicates}`);
  console.log(`Skipped Failed/404s: ${skippedFailed}`);
  console.log(`✨ NEW UNIQUE GLASSWARE PRODUCTS ADDED: ${newGlasswareProducts.length}`);
  console.log(`========================================\n`);

  // Sample newly added products
  if (newGlasswareProducts.length > 0) {
    console.log('Sample New Products Added:');
    newGlasswareProducts.slice(0, 8).forEach(p => {
      console.log(`- [SKU: ${p.itemCode}${p.aliasName ? ' · ' + p.aliasName : ''}] ${p.name} | Cat: ${p.categoryName} | Price: ₹${p.price} (Base ₹${p.basePrice} + ₹20) | ${p.images.length} Images`);
    });
  }

  // Merge with existing products
  const finalCatalog = [...existingProducts, ...newGlasswareProducts];
  console.log(`\n🎉 Total Ruup Glass Catalog Count: ${finalCatalog.length} Products!`);

  // Write to src/data/products.js
  const jsContent = `export const INITIAL_PRODUCTS = ${JSON.stringify(finalCatalog, null, 2)};\n`;
  fs.writeFileSync('src/data/products.js', jsContent, 'utf8');
  console.log('✅ Updated src/data/products.js successfully with all merged products!');

  fs.writeFileSync('new_added_jds_products.json', JSON.stringify(newGlasswareProducts, null, 2), 'utf8');
}

scrapeAndMerge().catch(console.error);
