const http = require('http');

function testProductUpdate() {
  const productData = {
    name: "Test Product",
    description: "Test Description",
    price: 10.99,
    stock: 100,
    brand: "Test Brand",
    brandId: 1,
    categoryId: 1,
    isActive: true
  };

  const postData = JSON.stringify(productData);

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('Testing product creation with brand...');
  console.log('Product data:', productData);

  const req = http.request(options, (res) => {
    console.log(`API Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response length:', data.length);
      if (data.length > 0) {
        try {
          const jsonData = JSON.parse(data);
          console.log('Response data:', jsonData);
        } catch (e) {
          console.log('Response is not JSON:', data.substring(0, 200));
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('API Error:', error.message);
    console.log('This means the backend server is not running.');
    console.log('Please start the backend server with: npm run start:dev');
  });

  req.write(postData);
  req.end();
}

testProductUpdate();
