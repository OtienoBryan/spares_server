const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🧪 Testing API Endpoints...\n');

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 1: Get brands
    console.log('1. Testing brands endpoint...');
    try {
      const brandsResponse = await makeRequest('/api/admin/brands');
      console.log('   Status:', brandsResponse.status);
      if (brandsResponse.status === 200) {
        console.log('   ✅ Brands endpoint working');
        console.log('   Brands found:', brandsResponse.data.length);
        if (brandsResponse.data.length > 0) {
          console.log('   Sample brand:', brandsResponse.data[0]);
        }
      } else {
        console.log('   ❌ Brands endpoint failed:', brandsResponse.data);
      }
    } catch (error) {
      console.log('   ❌ Brands endpoint error:', error.message);
    }

    // Test 2: Get products
    console.log('\n2. Testing products endpoint...');
    try {
      const productsResponse = await makeRequest('/api/admin/products');
      console.log('   Status:', productsResponse.status);
      if (productsResponse.status === 200) {
        console.log('   ✅ Products endpoint working');
        console.log('   Products found:', productsResponse.data.length);
        if (productsResponse.data.length > 0) {
          const product = productsResponse.data[0];
          console.log('   Sample product:', {
            id: product.id,
            name: product.name,
            brandId: product.brandId,
            brand: product.brand
          });
        }
      } else {
        console.log('   ❌ Products endpoint failed:', productsResponse.data);
      }
    } catch (error) {
      console.log('   ❌ Products endpoint error:', error.message);
    }

    // Test 3: Update a product with brand
    console.log('\n3. Testing product update...');
    try {
      const productsResponse = await makeRequest('/api/admin/products');
      if (productsResponse.status === 200 && productsResponse.data.length > 0) {
        const product = productsResponse.data[0];
        const brandsResponse = await makeRequest('/api/admin/brands');
        
        if (brandsResponse.status === 200 && brandsResponse.data.length > 0) {
          const brand = brandsResponse.data[0];
          const updateData = {
            brandId: brand.id
          };
          
          console.log(`   Updating product ${product.id} with brandId: ${brand.id}`);
          console.log('   Update data:', updateData);
          
          const updateResponse = await makeRequest(`/api/admin/products/${product.id}`, 'PUT', updateData);
          console.log('   Update status:', updateResponse.status);
          
          if (updateResponse.status === 200) {
            console.log('   ✅ Product update successful');
            console.log('   Updated product:', {
              id: updateResponse.data.id,
              name: updateResponse.data.name,
              brandId: updateResponse.data.brandId,
              brand: updateResponse.data.brand
            });
          } else {
            console.log('   ❌ Product update failed:', updateResponse.data);
          }
        } else {
          console.log('   ❌ No brands available for update test');
        }
      } else {
        console.log('   ❌ No products available for update test');
      }
    } catch (error) {
      console.log('   ❌ Product update error:', error.message);
    }

    console.log('\n🎉 API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();





