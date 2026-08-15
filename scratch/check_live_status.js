const http = require('http');
const https = require('https');

function checkEndpoint(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400, sample: data.slice(0, 100) });
      });
    });
    req.on('error', (err) => {
      resolve({ url, status: 'ERROR', ok: false, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'TIMEOUT', ok: false });
    });
  });
}

async function run() {
  console.log('--- CHECKING LIVE STATUS OF TABLETURN ---');
  
  const frontendLocal = await checkEndpoint('http://localhost:5173');
  console.log('1. Local Frontend (Vite):', frontendLocal.ok ? `LIVE (HTTP ${frontendLocal.status})` : `OFFLINE (${frontendLocal.error})`);

  const backendLocal = await checkEndpoint('http://localhost:5000/api/health');
  console.log('2. Local Backend API (Express/Mongo):', backendLocal.ok ? `LIVE (HTTP ${backendLocal.status})` : `OFFLINE (${backendLocal.error})`);

  const ghPages = await checkEndpoint('https://raiyan-19.github.io/TableTurn/');
  console.log('3. Online GitHub Pages:', ghPages.ok ? `LIVE (HTTP ${ghPages.status})` : `Status: HTTP ${ghPages.status}`);

  console.log('-----------------------------------------');
}

run();
