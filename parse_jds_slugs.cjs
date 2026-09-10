const fs = require('fs');

const sitemapXml = fs.readFileSync('jds_sitemap.xml', 'utf8');
const urls = [];
const regex = /<loc>(.*?)<\/loc>/g;
let match;
while ((match = regex.exec(sitemapXml)) !== null) {
  urls.push(match[1]);
}

console.log(`Total URLs in jds_sitemap.xml: ${urls.length}`);

// Breakdown of URLs
const catUrls = urls.filter(u => u.includes('/category/'));
const prodUrls = urls.filter(u => u.includes('/products/'));

console.log(`Category URLs: ${catUrls.length}`);
console.log(`Product URLs: ${prodUrls.length}`);

console.log('\nAll Category URLs:');
catUrls.forEach(c => console.log(' -', c));

// Filter product URLs by glassware keywords in the slug
const glassKeywords = [
  'glass', 'jar', 'bottle', 'decanter', 'mug', 'cup', 'bowl', 'tumbler', 
  'borosilicate', 'flint', 'beer', 'whisky', 'wine', 'kettle', 'lug', 
  'canister', 'cruet', 'ashtray', 'dish', 'goblet', 'carafe', 'saucer', 'jug',
  'candy', 'teapot', 'oil', 'pop', 'straw', 'pot', 'dessert', 'shot'
];

const glasswareProdUrls = prodUrls.filter(u => {
  const slug = u.toLowerCase();
  return glassKeywords.some(kw => slug.includes(kw));
});

console.log(`\nProbable Glassware Product URLs in sitemap based on slug: ${glasswareProdUrls.length} / ${prodUrls.length}`);
console.log('Sample glassware slugs (first 15):');
glasswareProdUrls.slice(0, 15).forEach(u => console.log(' -', u.replace('https://www.jdsenterprise.in/products/', '')));

fs.writeFileSync('jds_glassware_urls.json', JSON.stringify(glasswareProdUrls, null, 2));
