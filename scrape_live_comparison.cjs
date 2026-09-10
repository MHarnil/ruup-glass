const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function scrapeAllProducts() {
  console.log('Fetching all products from thebrahmani.com...');
  let offset = 0;
  const limit = 50;
  let allProducts = [];
  let hasMore = true;

  while (hasMore) {
    const url = `https://www.thebrahmani.com/api/products?offset=${offset}&limit=${limit}`;
    console.log(`Fetching offset: ${offset}...`);
    try {
      const res = await fetchJson(url);
      const items = res.products || (Array.isArray(res) ? res : []);
      if (!items || items.length === 0) {
        hasMore = false;
        break;
      }
      allProducts = allProducts.concat(items);
      console.log(`Received ${items.length} items. Total so far: ${allProducts.length}`);
      if (items.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    } catch (e) {
      console.error(`Error at offset ${offset}:`, e.message);
      hasMore = false;
    }
  }

  console.log(`\n🎉 Total products fetched from live site: ${allProducts.length}`);
  fs.writeFileSync('live_brahmani_products_raw.json', JSON.stringify(allProducts, null, 2), 'utf8');

  // Let's analyze categories from live products
  const categoryCounts = {};
  allProducts.forEach(p => {
    const cat = p.categoryName || p.category || p.itemGroup || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  console.log('\nCategory breakdown from live site:');
  console.table(categoryCounts);

  // Compare with current src/data/products.js
  if (fs.existsSync('src/data/products.js')) {
    const localContent = fs.readFileSync('src/data/products.js', 'utf8');
    const localJsonStr = localContent.replace('export const INITIAL_PRODUCTS = ', '').replace(/;\s*$/, '');
    const localProducts = JSON.parse(localJsonStr);
    console.log(`\nLocal products in website: ${localProducts.length}`);

    // Find new products by itemCode
    const localCodes = new Set(localProducts.map(p => String(p.itemCode)));
    const newItems = allProducts.filter(p => !localCodes.has(String(p.itemCode)));
    console.log(`New items found: ${newItems.length}`);
    if (newItems.length > 0) {
      console.log('Sample new items:');
      newItems.slice(0, 10).forEach(p => console.log(`- Code: ${p.itemCode} | Name: ${p.name} | Cat: ${p.categoryName || p.category}`));
    }

    // Check if any old items were removed or updated
    const liveCodes = new Set(allProducts.map(p => String(p.itemCode)));
    const missingInLive = localProducts.filter(p => !liveCodes.has(String(p.itemCode)));
    console.log(`Items in local but missing in live: ${missingInLive.length}`);
  }
}

scrapeAllProducts();
