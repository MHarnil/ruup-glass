const fs = require('fs');

// Read src/data/products.js
const fileContent = fs.readFileSync('src/data/products.js', 'utf8');

// Extract JSON array
const jsonStr = fileContent.replace('export const INITIAL_PRODUCTS = ', '').replace(/;\s*$/, '');
const products = JSON.parse(jsonStr);

console.log(`Updating prices for ${products.length} products (+ ₹20 each)...`);

// Sample before
console.log('Sample BEFORE:');
products.slice(0, 5).forEach(p => console.log(`${p.name} (Code: ${p.itemCode}): ₹${p.price}`));

const updated = products.map(p => ({
  ...p,
  price: Number(p.price) + 20
}));

console.log('\nSample AFTER (+ ₹20):');
updated.slice(0, 5).forEach(p => console.log(`${p.name} (Code: ${p.itemCode}): ₹${p.price}`));

// Write back to src/data/products.js
const newJsContent = `export const INITIAL_PRODUCTS = ${JSON.stringify(updated, null, 2)};\n`;
fs.writeFileSync('src/data/products.js', newJsContent, 'utf8');

console.log('✅ Successfully updated src/data/products.js with +₹20 price increase on all products!');
