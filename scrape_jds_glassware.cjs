const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 12000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.origin}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', () => resolve({ statusCode: 500, data: '' })).on('timeout', () => resolve({ statusCode: 408, data: '' }));
  });
}

function parsePcsPerCarton(str, name) {
  if (!str && !name) return 1;
  const target = `${str || ''} ${name || ''}`;
  const m = target.match(/(\d+)\s*(?:PCS|PC|SET|SETS|CTN|BOX|BXS|P)/i);
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
  if (n.includes('JAR') || n.includes('GHEE') || n.includes('HONEY') || n.includes('FUDKOR') || n.includes('CONTAINER') || n.includes('POP JAR') || n.includes('CANDY')) {
    return { id: 'jars', name: 'Glass Jars & Storage' };
  }
  if (n.includes('BOTTLE') || n.includes('MILK') || n.includes('WATER BOTTLE') || n.includes('OIL BOTTLE') || n.includes('SG ') || n.includes('GM ') || n.includes('FLASK') || n.includes('DISPENSER')) {
    return { id: 'bottles', name: 'Milk & Water Bottles' };
  }
  if (n.includes('WHISKY') || n.includes('WINE') || n.includes('CUP') || n.includes('MUG') || n.includes('GLASS') || n.includes('JUG') || n.includes('ICE CUBES') || n.includes('BEER') || n.includes('TUMBLER') || n.includes('SHOT') || n.includes('DRINKWARE') || n.includes('TEA') || n.includes('STRAW')) {
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

function extractCapacity(name) {
  const m = name.match(/(\d+(?:\.\d+)?\s*(?:ML|KG|GMS|GM|LTR|L|INCH|PCS|SET|SETS))/i);
  return m ? m[0] : 'Standard Trade Spec';
}

function extractMouthSize(name) {
  const m = name.match(/(\d+MM)/i);
  return m ? `${m[0]} Neck / Fit` : 'Standard Fit';
}

function isGlasswareProduct(productObj, html) {
  const text = `${productObj.name || ''} ${productObj.category || ''} ${productObj.description || ''} ${html || ''}`.toUpperCase();
  
  // Exclude non-glassware categories like ladders, plastic brooms, textiles
  if (text.includes('LADDER') || text.includes('MOP') || text.includes('CLOTH') || text.includes('STEEL RACK') || text.includes('WOODEN CHAIR') || text.includes('STEP STOOL')) {
    return false;
  }

  // Check if categorized under Glassware Products
  if (productObj.category && productObj.category.toLowerCase().includes('glassware')) {
    return true;
  }

  // Keywords indicative of glassware
  const glassKeywords = [
    'GLASS', 'JAR', 'BOTTLE', 'DECANTER', 'MUG', 'CUP', 'BOWL', 'TUMBLER', 
    'BOROSILICATE', 'FLINT', 'BEER', 'WHISKY', 'WINE', 'KETTLE', 'LUG CAP', 
    'CANISTER', 'CRUET', 'ASHTRAY', 'DISH', 'GOBLET', 'CARAFE', 'SAUCER', 'JUG'
  ];

  return glassKeywords.some(kw => text.includes(kw));
}

async function scrapeJDSProducts() {
  console.log('Reading sitemap URLs...');
  const sitemapXml = fs.readFileSync('jds_sitemap.xml', 'utf8');
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapXml)) !== null) {
    if (match[1].includes('/products/')) {
      urls.push(match[1]);
    }
  }

  console.log(`Found ${urls.length} product URLs to scrape from JDS Enterprise`);

  // Load existing products from Ruup Glass
  const existingContent = fs.readFileSync('src/data/products.js', 'utf8');
  const existingJsonStr = existingContent.replace('export const INITIAL_PRODUCTS = ', '').replace(/;\s*$/, '');
  const existingProducts = JSON.parse(existingJsonStr);
  console.log(`Current Ruup Glass products count: ${existingProducts.length}`);

  // Create lookup sets for fast duplicate detection
  const existingCodes = new Set(existingProducts.map(p => String(p.itemCode).toLowerCase().trim()));
  const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

  const BATCH_SIZE = 20;
  const scrapedProducts = [];
  let skippedNonGlass = 0;
  let skippedDuplicates = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batchUrls = urls.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i + 1} - ${Math.min(i + BATCH_SIZE, urls.length)} / ${urls.length}...`);

    const batchPromises = batchUrls.map(async (url) => {
      const res = await fetchUrl(url);
      if (res.statusCode !== 200 || !res.data) return null;

      const html = res.data;
      
      // Extract Product JSON-LD
      const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
      let productLd = null;
      let breadcrumbLd = null;

      for (const m of ldMatches) {
        try {
          const parsed = JSON.parse(m[1]);
          if (parsed['@type'] === 'Product') productLd = parsed;
          if (parsed['@type'] === 'BreadcrumbList') breadcrumbLd = parsed;
        } catch (e) {}
      }

      if (!productLd || !productLd.name) return null;

      // Extract carton quantity & material from HTML text
      const cartonMatch = html.match(/Carton Quantity<\/span>\s*<span[^>]*>(.*?)<\/span>/i) ||
                          html.match(/Packing<\/span>\s*<span[^>]*>(.*?)<\/span>/i) ||
                          html.match(/Wholesale rate\s*·\s*([^<\n]+)/i);
      const cartonStr = cartonMatch ? cartonMatch[1].trim() : '';

      const materialMatch = html.match(/Material<\/span>\s*<span[^>]*>(.*?)<\/span>/i);
      const materialStr = materialMatch ? materialMatch[1].trim() : 'Clear Flint Glass';

      const subCatMatch = html.match(/Sub-category<\/span>\s*<span[^>]*>(.*?)<\/span>/i);
      const subCatStr = subCatMatch ? subCatMatch[1].trim() : '';

      // Check if it's glassware
      if (!isGlasswareProduct(productLd, html)) {
        skippedNonGlass++;
        return null;
      }

      const { itemCode, aliasName } = parseItemCodeAndAlias(productLd.sku, productLd.name, url);

      // Duplicate check: check itemCode and normalized name
      const cleanName = productLd.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (existingCodes.has(String(itemCode).toLowerCase().trim()) || existingNames.has(cleanName)) {
        skippedDuplicates++;
        return null;
      }

      // Format Images
      let images = [];
      if (Array.isArray(productLd.image)) {
        images = productLd.image;
      } else if (typeof productLd.image === 'string') {
        images = [productLd.image];
      }
      if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'];
      }

      // Base Price & Price Rule: add ₹20 to JDS price as requested
      const rawPrice = Number(productLd.offers?.price) || 0;
      const finalPrice = rawPrice + 20;

      const cat = mapCategory(productLd.name, productLd.category, subCatStr);
      const pcsPerCarton = parsePcsPerCarton(cartonStr, productLd.name);

      return {
        id: `jds-${itemCode}`,
        itemCode: itemCode,
        aliasName: aliasName,
        name: productLd.name.replace(/\s+/g, ' ').trim(),
        category: cat.id,
        categoryName: cat.name,
        price: finalPrice,
        basePrice: rawPrice,
        source: 'JDS Enterprise',
        piecesPerCarton: pcsPerCarton,
        moqCartons: 1,
        image: images[0],
        images: images,
        description: productLd.description || `${productLd.name} - Commercial glassware supply with carton packaging, Surat godown dispatch.`,
        capacity: extractCapacity(productLd.name),
        mouthSize: extractMouthSize(productLd.name),
        material: materialStr.includes('Glass') ? materialStr : 'Clear Borosilicate / Soda-Lime Glass',
        inStock: productLd.offers?.availability?.includes('InStock') ?? true,
        featured: false,
        tags: [cat.name, subCatStr, 'JDS Glassware', 'Surat Wholesale'].filter(Boolean)
      };
    });

    const batchResults = await Promise.all(batchPromises);
    for (const item of batchResults) {
      if (item) {
        // Track in lookup sets so intra-batch duplicates are also prevented
        existingCodes.add(String(item.itemCode).toLowerCase().trim());
        existingNames.add(item.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
        scrapedProducts.push(item);
      }
    }
  }

  console.log(`\n================================`);
  console.log(`🎉 JDS Scraping Complete!`);
  console.log(`Total URLs processed: ${urls.length}`);
  console.log(`Skipped non-glassware items: ${skippedNonGlass}`);
  console.log(`Skipped duplicate items: ${skippedDuplicates}`);
  console.log(`✨ New Unique Glassware Products Found: ${scrapedProducts.length}`);
  console.log(`================================\n`);

  fs.writeFileSync('new_jds_glassware_products.json', JSON.stringify(scrapedProducts, null, 2), 'utf8');
}

scrapeJDSProducts().catch(console.error);
