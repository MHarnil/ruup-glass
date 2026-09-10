const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function inspectProductPage() {
  const testUrl = 'https://www.jdsenterprise.in/products/frozen-dessert-wine-glass-6pcs-deli-22837-gl1613-22837-gl1613';
  console.log(`Fetching sample product page: ${testUrl}...`);
  const res = await fetchUrl(testUrl);
  console.log('Status:', res.statusCode, 'Length:', res.data.length);
  fs.writeFileSync('jds_sample_product.html', res.data);

  // Check for Next.js __NEXT_DATA__
  const nextDataMatch = res.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (nextDataMatch) {
    console.log('Found __NEXT_DATA__!');
    const parsed = JSON.parse(nextDataMatch[1]);
    console.log('Next.js pageProps keys:', Object.keys(parsed.props?.pageProps || {}));
    fs.writeFileSync('jds_next_data.json', JSON.stringify(parsed.props?.pageProps, null, 2));
  }

  // Check for JSON-LD
  const ldJsonMatches = [...res.data.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  console.log(`Found ${ldJsonMatches.length} JSON-LD blocks`);
  ldJsonMatches.forEach((m, idx) => {
    try {
      const obj = JSON.parse(m[1]);
      console.log(`JSON-LD ${idx + 1} type:`, obj['@type']);
      if (obj['@type'] === 'Product') {
        console.log('Product Name:', obj.name);
        console.log('Product SKU:', obj.sku);
        console.log('Product Price:', obj.offers?.price);
        console.log('Product Images:', obj.image);
      }
    } catch (e) {}
  });

  // Check for Remix / React Router .data endpoint
  const dotDataRes = await fetchUrl('https://www.jdsenterprise.in/products/frozen-dessert-wine-glass-6pcs-deli-22837-gl1613-22837-gl1613.data');
  console.log('Status for .data:', dotDataRes.statusCode, 'Length:', dotDataRes.data.length);
}

inspectProductPage().catch(console.error);
