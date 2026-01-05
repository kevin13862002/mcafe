#!/usr/bin/env node
// Test adding a product to Supabase via the admin API

const http = require('http');

function request(method, path, body = null, sessionId = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
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
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testAddProduct() {
  console.log('\n=== Testing Add Products Functionality ===\n');

  try {
    // Sign in
    console.log('[1] Signing in with password: admin123');
    const signin = await request('POST', '/api/admin/signin', { password: 'admin123' });
    console.log('    Response: ' + JSON.stringify(signin.body));
    
    if (!signin.body?.sessionId) {
      console.error('    ERROR: Could not sign in');
      return;
    }
    
    const sessionId = signin.body.sessionId;
    console.log('    SUCCESS: sessionId = ' + sessionId.substring(0, 8) + '...\n');

    // Get existing products
    console.log('[2] Fetching current products');
    const getProducts = await request('GET', '/api/products');
    const existingCount = getProducts.body?.data?.length || 0;
    console.log('    Found ' + existingCount + ' products\n');

    // Add a product
    console.log('[3] Adding new product: Vanilla Cake');
    const newProduct = {
      name: 'Vanilla Cake',
      price: 18.99,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
    };
    
    const addProduct = await request('POST', '/api/admin/products', newProduct, sessionId);
    console.log('    Status: ' + addProduct.status);
    console.log('    Response: ' + JSON.stringify(addProduct.body));
    
    if (addProduct.status === 200 || addProduct.status === 201) {
      console.log('    SUCCESS: Product added!\n');

      // Verify count increased
      console.log('[4] Verifying product count');
      const verify = await request('GET', '/api/products');
      const newCount = verify.body?.data?.length || 0;
      console.log('    New product count: ' + newCount);
      console.log('    Count increased: ' + (newCount > existingCount ? 'YES' : 'NO') + '\n');
      
      if (newCount > existingCount) {
        console.log('✓ SUCCESS: Add products is working!\n');
      }
    } else {
      console.error('    ERROR: Status ' + addProduct.status + '\n');
    }

  } catch (err) {
    console.error('ERROR: ' + err.message);
  }
}

testAddProduct();
