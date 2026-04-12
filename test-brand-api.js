const axios = require('axios');

async function testBrandUpdateAPI() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing Brand Update API...');
    
    // Test if server is running
    console.log('📡 Testing server connection...');
    try {
      await axios.get(`${baseURL}/api/admin/products`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server is not running or not accessible');
      console.log('Error:', error.message);
      return;
    }
    
    // Get products
    console.log('📡 Getting products...');
    const productsResponse = await axios.get(`${baseURL}/api/admin/products`);
    console.log('✅ Products retrieved:', productsResponse.data.length);
    
    if (productsResponse.data.length === 0) {
      console.log('❌ No products found');
      return;
    }
    
    const testProduct = productsResponse.data[0];
    console.log('🎯 Test product:', {
      id: testProduct.id,
      name: testProduct.name,
      brand: testProduct.brand,
      brandId: testProduct.brandId
    });
    
    // Get brands
    console.log('📡 Getting brands...');
    const brandsResponse = await axios.get(`${baseURL}/api/admin/brands`);
    console.log('✅ Brands retrieved:', brandsResponse.data.length);
    
    if (brandsResponse.data.length === 0) {
      console.log('❌ No brands found');
      return;
    }
    
    const testBrand = brandsResponse.data[0];
    console.log('🎯 Test brand:', testBrand);
    
    // Test brand update
    console.log('🔄 Testing brand update...');
    const updateData = {
      ...testProduct,
      brandId: testBrand.id,
      brand: testBrand.name
    };
    
    console.log('📤 Update data:', {
      brandId: updateData.brandId,
      brand: updateData.brand
    });
    
    const updateResponse = await axios.put(
      `${baseURL}/api/admin/products/${testProduct.id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Update successful!');
    console.log('📦 Updated product:', {
      id: updateResponse.data.id,
      name: updateResponse.data.name,
      brand: updateResponse.data.brand,
      brandId: updateResponse.data.brandId
    });
    
    // Verify the update
    console.log('📡 Verifying update...');
    const verifyResponse = await axios.get(`${baseURL}/api/admin/products/${testProduct.id}`);
    console.log('✅ Verification successful!');
    console.log('📦 Verified product:', {
      id: verifyResponse.data.id,
      name: verifyResponse.data.name,
      brand: verifyResponse.data.brand,
      brandId: verifyResponse.data.brandId
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
}

testBrandUpdateAPI();
