// Test script to verify admin can add products
const http = require('http');

const BASE_URL = 'http://localhost:8000';

function makeRequest(method, path, body = null, sessionId = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (sessionId) {
      options.headers['x-session-id'] = sessionId;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('\n=== Testing Add Product Functionality ===\n');

  try {
    // Step 1: Sign in
    console.log('[1] Signing in...');
    const signInRes = await makeRequest('POST', '/api/admin/signin', { password: 'admin123' });
    console.log('    Status: ' + signInRes.status);
    console.log('    Response: ' + JSON.stringify(signInRes.data));
    
    if (!signInRes.data || !signInRes.data.sessionId) {
      console.error('FAILED: Sign in failed');
      process.exit(1);
    }

    const sessionId = signInRes.data.sessionId;
    console.log('    Session ID: ' + sessionId.substring(0, 10) + '...\n');

    // Step 2: Get current products
    console.log('[2] Fetching current products...');
    const getRes = await makeRequest('GET', '/api/products');
    console.log('    Status: ' + getRes.status);
    const productCount = getRes.data?.data?.length || 0;
    console.log('    Found ' + productCount + ' products\n');

    // Step 3: Add a test product
    console.log('[3] Adding a test product...');
    const testProduct = {
      name: 'Chocolate Cake (Test)',
      price: 25.99,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
    };
    
    const addRes = await makeRequest('POST', '/api/admin/products', testProduct, sessionId);
    
    console.log('    Status: ' + addRes.status);
    console.log('    Response: ' + JSON.stringify(addRes.data));

    if (addRes.status === 200 || addRes.status === 201) {
      console.log('    Product added successfully!\n');

      // Step 4: Verify product was added
      console.log('[4] Verifying product was added...');
      const verifyRes = await makeRequest('GET', '/api/products');
      const newProductCount = verifyRes.data?.data?.length || 0;
      console.log('    Now ' + newProductCount + ' products found\n');

      if (newProductCount > productCount) {
        console.log('SUCCESS: Product addition works!\n');
      } else {
        console.log('WARNING: Product count did not increase\n');
      }
    } else if (addRes.status === 401) {
      console.error('FAILED: Need proper session ID header in request\n');
    } else {
      console.error('FAILED: Status ' + addRes.status + '\n');
    }

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

test();
