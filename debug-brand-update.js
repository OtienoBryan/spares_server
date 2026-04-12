const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/admin';

async function debugBrandUpdate() {
  try {
    console.log('🔍 Debugging Brand Update Issue...\n');

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    try {
      const response = await axios.get(`${API_BASE}/brands`);
      console.log('   ✅ Server is running');
      console.log('   Brands found:', response.data.length);
      if (response.data.length > 0) {
        console.log('   Sample brand:', response.data[0]);
      }
    } catch (error) {
      console.log('   ❌ Server connection failed:', error.message);
      return;
    }

    // Test 2: Get products
    console.log('\n2. Getting products...');
    const productsResponse = await axios.get(`${API_BASE}/products`);
    const products = productsResponse.data;
    console.log(`   Found ${products.length} products`);

    if (products.length === 0) {
      console.log('   No products found. Creating a test product...');
      
      // Get categories
      const categoriesResponse = await axios.get(`${API_BASE}/categories`);
      const categories = categoriesResponse.data;
      
      if (categories.length === 0) {
        console.log('   ❌ No categories found. Please add some categories first.');
        return;
      }
      
      // Create a test product
      const testProduct = {
        name: 'Test Product for Brand Debug',
        description: 'A test product to debug brand update',
        price: 15.99,
        stock: 50,
        categoryId: categories[0].id,
        brandId: null,
        brand: '',
        isActive: true
      };
      
      const createResponse = await axios.post(`${API_BASE}/products`, testProduct);
      const createdProduct = createResponse.data;
      console.log(`   ✅ Created product with ID: ${createdProduct.id}`);
      console.log(`   Created product brandId: ${createdProduct.brandId}`);
      console.log(`   Created product brand: "${createdProduct.brand}"`);
      
      // Test updating the brand
      console.log('\n3. Testing brand update...');
      const brandsResponse = await axios.get(`${API_BASE}/brands`);
      const brands = brandsResponse.data;
      
      if (brands.length === 0) {
        console.log('   ❌ No brands found. Please add some brands first.');
        return;
      }
      
      const newBrandId = brands[0].id;
      const updateData = {
        brandId: newBrandId
      };
      
      console.log(`   Updating product ${createdProduct.id} with brandId: ${newBrandId}`);
      console.log('   Update data:', updateData);
      
      const updateResponse = await axios.put(`${API_BASE}/products/${createdProduct.id}`, updateData);
      const updatedProduct = updateResponse.data;
      
      console.log('   ✅ Update successful!');
      console.log(`   Updated product brandId: ${updatedProduct.brandId}`);
      console.log(`   Updated product brand: "${updatedProduct.brand}"`);
      
      // Verify the update
      if (updatedProduct.brandId === newBrandId && updatedProduct.brand === brands[0].name) {
        console.log('   ✅ Brand update verification successful!');
      } else {
        console.log('   ❌ Brand update verification failed!');
        console.log(`   Expected brandId: ${newBrandId}, got: ${updatedProduct.brandId}`);
        console.log(`   Expected brand: "${brands[0].name}", got: "${updatedProduct.brand}"`);
      }
      
    } else {
      // Test with existing product
      const testProduct = products[0];
      console.log(`   Using product: ${testProduct.name} (ID: ${testProduct.id})`);
      console.log(`   Current brandId: ${testProduct.brandId}`);
      console.log(`   Current brand: "${testProduct.brand}"`);
      
      // Get brands
      const brandsResponse = await axios.get(`${API_BASE}/brands`);
      const brands = brandsResponse.data;
      console.log(`   Found ${brands.length} brands`);
      
      if (brands.length === 0) {
        console.log('   ❌ No brands found. Please add some brands first.');
        return;
      }
      
      // Test updating to a different brand
      const newBrandId = brands.find(b => b.id !== testProduct.brandId)?.id || brands[0].id;
      const updateData = {
        brandId: newBrandId
      };
      
      console.log(`\n3. Testing brand update...`);
      console.log(`   Updating product ${testProduct.id} with brandId: ${newBrandId}`);
      console.log('   Update data:', updateData);
      
      const updateResponse = await axios.put(`${API_BASE}/products/${testProduct.id}`, updateData);
      const updatedProduct = updateResponse.data;
      
      console.log('   ✅ Update successful!');
      console.log(`   Updated product brandId: ${updatedProduct.brandId}`);
      console.log(`   Updated product brand: "${updatedProduct.brand}"`);
      
      // Verify the update
      const expectedBrand = brands.find(b => b.id === newBrandId);
      if (updatedProduct.brandId === newBrandId && updatedProduct.brand === expectedBrand.name) {
        console.log('   ✅ Brand update verification successful!');
      } else {
        console.log('   ❌ Brand update verification failed!');
        console.log(`   Expected brandId: ${newBrandId}, got: ${updatedProduct.brandId}`);
        console.log(`   Expected brand: "${expectedBrand.name}", got: "${updatedProduct.brand}"`);
      }
    }

    console.log('\n🎉 Brand update debug completed!');

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Headers:', error.response.headers);
    }
  }
}

debugBrandUpdate();





