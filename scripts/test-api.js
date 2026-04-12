const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/products',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

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
          console.log('Response data (first item):', jsonData[0] ? Object.keys(jsonData[0]) : 'No data');
        } catch (e) {
          console.log('Response is not JSON:', data.substring(0, 100));
        }
      }
    });
  });

  req.on('error', (error) => {
    console.error('API Error:', error.message);
  });

  req.end();
}

console.log('Testing API...');
testAPI();
