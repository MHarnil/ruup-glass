const fs = require('fs');

const products = JSON.parse(fs.readFileSync('all_brahmani_products.json', 'utf8'));

console.log(`Total raw products from Brahmani: ${products.length}`);

// Inspect first 5 products
console.log('\nSample raw products:');
products.slice(0, 5).forEach(p => {
  console.log(`Code: ${p.itemCode} | Name: ${p.name} | Cat: ${JSON.stringify(p.categories)} | Alias: ${p.aliasName} | Price: ${p.price}`);
});

// Let's inspect all categories across all products
const catMap = {};
products.forEach(p => {
  if (Array.isArray(p.categories)) {
    p.categories.forEach(c => {
      const name = typeof c === 'object' ? (c.name || c.title || JSON.stringify(c)) : String(c);
      catMap[name] = (catMap[name] || 0) + 1;
    });
  } else if (p.categories) {
    catMap[p.categories] = (catMap[p.categories] || 0) + 1;
  }
});

console.log('\nCategories in raw Brahmani products:');
console.table(catMap);
