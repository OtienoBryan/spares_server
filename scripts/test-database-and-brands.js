const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseAndBrands() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🔍 Testing database connection and brands...');
    
    // Test 1: Check if brands table exists and has data
    const [brands] = await connection.execute('SELECT * FROM brands LIMIT 5');
    console.log('📊 Brands in database:', brands.length);
    if (brands.length > 0) {
      console.log('  Sample brands:', brands.map(b => ({ id: b.id, name: b.name, categoryId: b.categoryId })));
    }
    
    // Test 2: Check if products have brandId column
    const [products] = await connection.execute('SELECT id, name, brand, brandId FROM products LIMIT 3');
    console.log('📦 Products with brand info:', products.length);
    products.forEach(p => {
      console.log(`  Product ${p.id}: "${p.name}" - brand: "${p.brand}", brandId: ${p.brandId}`);
    });
    
    // Test 3: Update a product with brand info
    if (brands.length > 0 && products.length > 0) {
      const brand = brands[0];
      const product = products[0];
      
      console.log(`\n🔄 Testing brand update for product ${product.id} with brand ${brand.id}...`);
      
      const updateResult = await connection.execute(
        'UPDATE products SET brand = ?, brandId = ? WHERE id = ?',
        [brand.name, brand.id, product.id]
      );
      
      console.log(`  Update result: ${updateResult[0].affectedRows} rows affected`);
      
      // Verify the update
      const [updatedProduct] = await connection.execute(
        'SELECT id, name, brand, brandId FROM products WHERE id = ?',
        [product.id]
      );
      
      const updated = updatedProduct[0];
      console.log(`  After update: brand="${updated.brand}", brandId=${updated.brandId}`);
      
      if (updated.brand === brand.name && updated.brandId == brand.id) {
        console.log('✅ Brand update test successful!');
      } else {
        console.log('❌ Brand update test failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  } finally {
    await connection.end();
  }
}

testDatabaseAndBrands();
