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
          resolve({ error: e.message, raw: data.slice(0, 500) });
        }
      });
    }).on('error', reject);
  });
}

async function scrapeAll() {
  console.log('Testing /api/products?offset=0 ...');
  const res0 = await fetchJson('https://www.thebrahmani.com/api/products?offset=0');
  console.log('Res 0 keys:', Object.keys(res0));
  if (res0.products) {
    console.log(`Received ${res0.products.length} products, hasMore: ${res0.hasMore}`);
  } else {
    console.log('Response:', res0);
    return;
  }

  let allProducts = [...res0.products];
  let offset = res0.products.length;
  let hasMore = res0.hasMore;

  while (hasMore) {
    console.log(`Fetching offset: ${offset}...`);
    const nextRes = await fetchJson(`https://www.thebrahmani.com/api/products?offset=${offset}`);
    if (nextRes.products && nextRes.products.length > 0) {
      allProducts = allProducts.concat(nextRes.products);
      offset += nextRes.products.length;
      hasMore = nextRes.hasMore;
      console.log(`Total collected so far: ${allProducts.length} (hasMore: ${hasMore})`);
    } else {
      console.log('No more products or error:', nextRes);
      break;
    }
  }

  console.log(`\n🎉 Successfully fetched ALL ${allProducts.length} products from Brahmani!`);
  fs.writeFileSync('all_brahmani_products.json', JSON.stringify(allProducts, null, 2));
  console.log('Saved to all_brahmani_products.json');
}

scrapeAll().catch(console.error);
