const fs = require('fs');

const html = fs.readFileSync('jds_sample_product.html', 'utf8');

// Find all JSON-LD
const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
ldMatches.forEach((m, i) => {
  console.log(`\n--- JSON-LD ${i + 1} ---`);
  console.log(JSON.stringify(JSON.parse(m[1]), null, 2));
});

// Check HTML snippets for piecesPerCarton / Carton / Box / MOQ / Specifications
const textLines = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                      .replace(/<[^>]+>/g, '\n')
                      .split('\n')
                      .map(l => l.trim())
                      .filter(l => l.length > 0);

console.log('\n--- Text content sample around product details ---');
console.log(textLines.slice(0, 100).join('\n'));
