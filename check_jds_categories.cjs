const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', () => resolve({ statusCode: 500, data: '' })).on('timeout', () => resolve({ statusCode: 408, data: '' }));
  });
}

async function checkJdsCategories() {
  const catRes = await fetchUrl('https://www.jdsenterprise.in/category/glassware-products');
  console.log('Glassware category page status:', catRes.statusCode, 'Length:', catRes.data.length);
  fs.writeFileSync('jds_glassware_cat.html', catRes.data);

  // Check if there are products on this page or pagination links
  const links = [...catRes.data.matchAll(/href="([^"]*products\/[^"]*)"/g)].map(m => m[1]);
  console.log(`Found ${links.length} product links on glassware category page`);
  console.log('Sample product links:', links.slice(0, 5));

  // Check subcategories
  const subCats = [...catRes.data.matchAll(/href="([^"]*category\/glassware-products\/[^"]*)"/g)].map(m => m[1]);
  console.log(`Subcategories on page: ${subCats.length}`, subCats);
}

checkJdsCategories().catch(console.error);
