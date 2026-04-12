const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixBrandUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🔧 Fixing brand update issue...');
    
    // Get all brands
    const [brands] = await connection.execute('SELECT * FROM brands ORDER BY name');
    console.log(`📊 Found ${brands.length} brands in database:`);
    brands.forEach(brand => {
      console.log(`  ${brand.id}: ${brand.name} (Category: ${brand.categoryId})`);
    });
    
    // Get products that need brand updates
    const [products] = await connection.execute(`
      SELECT id, name, brand, brandId 
      FROM products 
      WHERE brandId IS NULL OR brand = '' OR brand IS NULL
      ORDER BY id
    `);
    
    console.log(`\n📦 Found ${products.length} products without brand info:`);
    products.forEach(product => {
      console.log(`  ${product.id}: "${product.name}" - brand: "${product.brand}", brandId: ${product.brandId}`);
    });
    
    if (brands.length === 0) {
      console.log('❌ No brands found in database. Please add brands first.');
      return;
    }
    
    if (products.length === 0) {
      console.log('✅ All products already have brand information.');
      return;
    }
    
    // Update products with random brands
    console.log('\n🔄 Updating products with brand information...');
    
    for (const product of products) {
      // Select a random brand
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      
      const updateResult = await connection.execute(
        'UPDATE products SET brand = ?, brandId = ? WHERE id = ?',
        [randomBrand.name, randomBrand.id, product.id]
      );
      
      console.log(`  ✅ Updated product ${product.id} ("${product.name}") with brand "${randomBrand.name}" (ID: ${randomBrand.id})`);
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const [updatedProducts] = await connection.execute(`
      SELECT id, name, brand, brandId 
      FROM products 
      WHERE brandId IS NOT NULL AND brand != ''
      ORDER BY id
    `);
    
    console.log(`✅ ${updatedProducts.length} products now have brand information:`);
    updatedProducts.forEach(product => {
      console.log(`  ${product.id}: "${product.name}" - brand: "${product.brand}", brandId: ${product.brandId}`);
    });
    
    console.log('\n🎉 Brand update fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing brand updates:', error);
  } finally {
    await connection.end();
  }
}

fixBrandUpdate();
