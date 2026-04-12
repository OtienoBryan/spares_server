const axios = require('axios');

async function testAPIEndpoint() {
  try {
    console.log('🧪 Testing API endpoint...');
    
    // Test getting products first
    console.log('📡 Testing GET /api/admin/products...');
    const getResponse = await axios.get('http://localhost:3000/api/admin/products');
    console.log('✅ GET response status:', getResponse.status);
    console.log('📦 Products count:', getResponse.data.length);
    
    if (getResponse.data.length === 0) {
      console.log('❌ No products found');
      return;
    }
    
    const testProduct = getResponse.data[0];
    console.log('🎯 Test product:', {
      id: testProduct.id,
      name: testProduct.name,
      brand: testProduct.brand,
      brandId: testProduct.brandId
    });
    
    // Test getting brands
    console.log('📡 Testing GET /api/admin/brands...');
    const brandsResponse = await axios.get('http://localhost:3000/api/admin/brands');
    console.log('✅ Brands response status:', brandsResponse.status);
    console.log('🏷️ Brands count:', brandsResponse.data.length);
    
    if (brandsResponse.data.length === 0) {
      console.log('❌ No brands found');
      return;
    }
    
    const testBrand = brandsResponse.data[0];
    console.log('🎯 Test brand:', testBrand);
    
    // Test updating product with new brand
    console.log('📡 Testing PUT /api/admin/products/:id...');
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
      `http://localhost:3000/api/admin/products/${testProduct.id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Update response status:', updateResponse.status);
    console.log('📦 Updated product:', {
      id: updateResponse.data.id,
      name: updateResponse.data.name,
      brand: updateResponse.data.brand,
      brandId: updateResponse.data.brandId
    });
    
    // Verify the update by getting the product again
    console.log('📡 Verifying update...');
    const verifyResponse = await axios.get(`http://localhost:3000/api/admin/products/${testProduct.id}`);
    console.log('✅ Verification response status:', verifyResponse.status);
    console.log('📦 Verified product:', {
      id: verifyResponse.data.id,
      name: verifyResponse.data.name,
      brand: verifyResponse.data.brand,
      brandId: verifyResponse.data.brandId
    });
    
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
  }
}

testAPIEndpoint();
