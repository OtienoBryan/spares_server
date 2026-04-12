const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixBrandData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🔍 Checking for corrupted brand data...\n');

    // Check products with corrupted brandId (non-numeric values)
    const [corruptedProducts] = await connection.execute(`
      SELECT id, name, brandId, brand 
      FROM products 
      WHERE brandId IS NOT NULL 
      AND brandId != '' 
      AND brandId NOT REGEXP '^[0-9]+$'
    `);

    console.log(`Found ${corruptedProducts.length} products with corrupted brandId:`);
    corruptedProducts.forEach(product => {
      console.log(`  - Product ${product.id}: "${product.name}" - brandId: "${product.brandId}", brand: "${product.brand}"`);
    });

    if (corruptedProducts.length === 0) {
      console.log('✅ No corrupted brand data found!');
      return;
    }

    // Get all brands for mapping
    const [brands] = await connection.execute('SELECT id, name FROM brands');
    console.log(`\nAvailable brands (${brands.length}):`);
    brands.forEach(brand => {
      console.log(`  - Brand ${brand.id}: "${brand.name}"`);
    });

    // Fix corrupted data
    console.log('\n🔧 Fixing corrupted brand data...');
    
    for (const product of corruptedProducts) {
      // Try to find the brand by name
      const brand = brands.find(b => b.name === product.brandId);
      
      if (brand) {
        // Update the product with correct brandId and brand name
        await connection.execute(
          'UPDATE products SET brandId = ?, brand = ? WHERE id = ?',
          [brand.id, brand.name, product.id]
        );
        console.log(`  ✅ Fixed product ${product.id}: brandId "${product.brandId}" → ${brand.id}, brand → "${brand.name}"`);
      } else {
        // Clear the brand data if no matching brand found
        await connection.execute(
          'UPDATE products SET brandId = NULL, brand = NULL WHERE id = ?',
          [product.id]
        );
        console.log(`  ⚠️  Cleared brand data for product ${product.id}: brandId "${product.brandId}" not found in brands table`);
      }
    }

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const [fixedProducts] = await connection.execute(`
      SELECT id, name, brandId, brand 
      FROM products 
      WHERE brandId IS NOT NULL 
      AND brandId != '' 
      AND brandId NOT REGEXP '^[0-9]+$'
    `);

    if (fixedProducts.length === 0) {
      console.log('✅ All brand data is now correct!');
    } else {
      console.log(`❌ Still found ${fixedProducts.length} corrupted products:`);
      fixedProducts.forEach(product => {
        console.log(`  - Product ${product.id}: brandId: "${product.brandId}"`);
      });
    }

    // Show some sample corrected data
    const [sampleProducts] = await connection.execute(`
      SELECT id, name, brandId, brand 
      FROM products 
      WHERE brandId IS NOT NULL 
      LIMIT 5
    `);

    console.log('\n📊 Sample corrected data:');
    sampleProducts.forEach(product => {
      console.log(`  - Product ${product.id}: "${product.name}" - brandId: ${product.brandId}, brand: "${product.brand}"`);
    });

  } catch (error) {
    console.error('❌ Error fixing brand data:', error.message);
  } finally {
    await connection.end();
  }
}

fixBrandData();





