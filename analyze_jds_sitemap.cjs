const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function analyzeSitemap() {
  console.log('Fetching sitemap.xml...');
  const sitemapXml = await fetchUrl('https://www.jdsenterprise.in/sitemap.xml');
  fs.writeFileSync('jds_sitemap.xml', sitemapXml);
  
  // Extract all <loc>...</loc>
  const locs = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapXml)) !== null) {
    locs.push(match[1]);
  }

  console.log(`Total URLs in sitemap: ${locs.length}`);
  console.log('Sample URLs (first 20):');
  locs.slice(0, 20).forEach(u => console.log(' -', u));

  // Check if there are product sub-sitemaps
  const subSitemaps = locs.filter(u => u.includes('sitemap') || u.endsWith('.xml'));
  console.log(`Sub-sitemaps: ${subSitemaps.length}`);
  if (subSitemaps.length > 0) {
    console.log('Sub-sitemaps:', subSitemaps);
  }

  // Filter product URLs
  const productUrls = locs.filter(u => u.includes('/product/') || u.includes('/products/') || u.includes('/item/'));
  console.log(`Product URLs in sitemap: ${productUrls.length}`);
  if (productUrls.length > 0) {
    console.log('Sample product URLs:', productUrls.slice(0, 5));
  }
}

analyzeSitemap().catch(console.error);
