const https = require('https');
const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('jds_glassware_urls.json', 'utf8'));
console.log(`Total glassware URLs loaded: ${urls.length}`);

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }, 
      timeout: 15000 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    req.on('error', (err) => resolve({ statusCode: 500, error: err.message, data: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 408, error: 'Timeout', data: '' });
    });
  });
}

async function testSample() {
  console.log('Testing 10 URLs...');
  for (let i = 0; i < 10; i++) {
    const u = urls[i];
    console.log(`[${i+1}/10] Fetching: ${u}`);
    const res = await fetchUrl(u);
    console.log(` -> Status: ${res.statusCode}, Length: ${res.data.length}`);
    if (res.data.length > 0) {
      const ldMatch = res.data.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      if (ldMatch) {
        try {
          const p = JSON.parse(ldMatch[1]);
          console.log(`    Found JSON-LD: ${p.name} | Price: ₹${p.offers?.price}`);
        } catch (e) {}
      }
    }
  }
}

testSample();
