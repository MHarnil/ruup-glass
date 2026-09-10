const https = require('https');

const options = {
  hostname: 'www.jdsenterprise.in',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'close'
  },
  timeout: 15000
};

console.time('Home fetch');
const req = https.request(options, (res) => {
  console.log('Status code:', res.statusCode);
  let chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    console.timeEnd('Home fetch');
    const data = Buffer.concat(chunks).toString();
    console.log('Total bytes:', data.length);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.destroy();
});

req.end();
