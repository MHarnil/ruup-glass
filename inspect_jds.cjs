const https = require('https');
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.origin}${redirectUrl}`;
        }
        console.log(`Redirecting to: ${redirectUrl}`);
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function inspectJDS() {
  console.log('Inspecting https://www.jdsenterprise.in/ ...');
  try {
    const res = await fetchUrl('https://www.jdsenterprise.in/');
    console.log('Status:', res.statusCode, 'Length:', res.data.length);

    // Check if Shopify products.json exists
    const shopifyProducts = await fetchUrl('https://www.jdsenterprise.in/products.json?limit=10');
    console.log('Shopify products.json status:', shopifyProducts.statusCode, 'Length:', shopifyProducts.data.length);

    // Check collections
    const collections = await fetchUrl('https://www.jdsenterprise.in/collections.json');
    console.log('collections.json status:', collections.statusCode, 'Length:', collections.data.length);

    // Check sitemap
    const sitemap = await fetchUrl('https://www.jdsenterprise.in/sitemap.xml');
    console.log('sitemap.xml status:', sitemap.statusCode, 'Length:', sitemap.data.length);

    // Check if API endpoints exist
    const apiTest = await fetchUrl('https://www.jdsenterprise.in/api/products');
    console.log('api/products status:', apiTest.statusCode, 'Length:', apiTest.data.length);

    // Let's inspect some HTML title and meta from home
    const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);
    console.log('Home title:', titleMatch ? titleMatch[1] : 'No title');

    // Save home html to examine platform
    const fs = require('fs');
    fs.writeFileSync('jds_home.html', res.data.slice(0, 50000));
    console.log('Saved jds_home.html sample');
  } catch (e) {
    console.error('Error inspecting:', e.message);
  }
}

inspectJDS();
