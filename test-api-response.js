const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testAPIResponse() {
  try {
    console.log('🔍 Testing API Response...\n');

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test products endpoint
    console.log('1. Testing products endpoint...');
    try {
      const response = await makeRequest('/api/admin/products');
      console.log('   Status:', response.status);
      
      if (response.status === 200) {
        console.log('   ✅ Products endpoint working');
        console.log(`   Found ${response.data.length} products`);
        
        if (response.data.length > 0) {
          const product = response.data[0];
          console.log('\n   Sample product data:');
          console.log('   Product ID:', product.id);
          console.log('   Product Name:', product.name);
          console.log('   Brand ID:', product.brandId, '(type:', typeof product.brandId, ')');
          console.log('   Brand:', product.brand, '(type:', typeof product.brand, ')');
          console.log('   Category ID:', product.categoryId);
          console.log('   Category Name:', product.category?.name);
          
          // Check if brandId is corrupted
          if (product.brandId && typeof product.brandId === 'string' && isNaN(parseInt(product.brandId))) {
            console.log('   ❌ CORRUPTED: brandId contains non-numeric value:', product.brandId);
          } else {
            console.log('   ✅ brandId looks correct');
          }
        }
      } else {
        console.log('   ❌ Products endpoint failed:', response.data);
      }
    } catch (error) {
      console.log('   ❌ Products endpoint error:', error.message);
    }

    // Test brands endpoint
    console.log('\n2. Testing brands endpoint...');
    try {
      const response = await makeRequest('/api/admin/brands');
      console.log('   Status:', response.status);
      
      if (response.status === 200) {
        console.log('   ✅ Brands endpoint working');
        console.log(`   Found ${response.data.length} brands`);
        
        if (response.data.length > 0) {
          const brand = response.data[0];
          console.log('\n   Sample brand data:');
          console.log('   Brand ID:', brand.id, '(type:', typeof brand.id, ')');
          console.log('   Brand Name:', brand.name, '(type:', typeof brand.name, ')');
        }
      } else {
        console.log('   ❌ Brands endpoint failed:', response.data);
      }
    } catch (error) {
      console.log('   ❌ Brands endpoint error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPIResponse();





