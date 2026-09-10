const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function checkBrahmani() {
  console.log('Checking thebrahmani.com...');
  try {
    const home = await fetchUrl('https://www.thebrahmani.com/');
    console.log('Home status:', home.statusCode, 'Length:', home.data.length);

    // Check API endpoint
    const apiRes = await fetchUrl('https://www.thebrahmani.com/api/products?offset=0&limit=50');
    console.log('API /api/products status:', apiRes.statusCode, 'Length:', apiRes.data.length);
    if (apiRes.statusCode === 200) {
      try {
        const json = JSON.parse(apiRes.data);
        console.log('API products response type:', Array.isArray(json) ? `Array length: ${json.length}` : typeof json);
        if (json.total !== undefined || json.count !== undefined) {
          console.log('Total count in response:', json.total || json.count);
        }
        if (Array.isArray(json)) {
          console.log('Sample product 0:', json[0]?.name, json[0]?.itemCode);
        } else if (json.products) {
          console.log('Sample product 0 in json.products:', json.products[0]?.name, json.products[0]?.itemCode);
        }
      } catch (e) {
        console.log('Not JSON, first 200 chars:', apiRes.data.substring(0, 200));
      }
    }
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

checkBrahmani();
