const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }, 
      timeout: 12000 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', (err) => resolve({ statusCode: 500, error: err.message, data: '' }))
      .on('timeout', () => resolve({ statusCode: 408, error: 'Timeout', data: '' }));
  });
}

const testUrls = [
  'https://www.jdsenterprise.in/products/hoho-straw-cup-long-530ml-22384-h6-00030-22384-h6-00030',
  'https://www.jdsenterprise.in/products/green-tea-kettle-glass-strainer-800m-23147-23147',
  'https://www.jdsenterprise.in/products/green-tea-kettle-glass-strainer-800ml-xt-09-22050-xt-09-v2',
  'https://www.jdsenterprise.in/products/wooden-lid-jar-square-950ml-36-ctn-20274-gpg16-950-bb-20274-gpg16-950-bb',
  'https://www.jdsenterprise.in/products/glass-oil-brushjar-230ml-1pcs-23196-msb-118-23196-msb-118'
];

async function runTest() {
  console.log('Testing 5 URLs sequentially...');
  for (const url of testUrls) {
    console.log('Fetching:', url.split('/').pop());
    const res = await fetchUrl(url);
    console.log(`Status: ${res.statusCode} | Length: ${res.data.length}`);
    if (res.data) {
      const nameMatch = res.data.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const priceMatch = res.data.match(/₹\s*(\d+)/i);
      console.log(`Name: ${nameMatch ? nameMatch[1].trim() : 'N/A'} | Price: ${priceMatch ? priceMatch[1] : 'N/A'}`);
    }
    // Small pause
    await new Promise(r => setTimeout(r, 200));
  }
}

runTest();
