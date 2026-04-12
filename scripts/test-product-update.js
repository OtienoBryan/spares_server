const mysql = require('mysql2/promise');
require('dotenv').config();

async function testProductUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Testing product update with brandId...');
    
    // Get a product to test with
    const [products] = await connection.execute('SELECT id, name, brandId FROM products LIMIT 1');
    
    if (products.length === 0) {
      console.log('❌ No products found to test with');
      return;
    }
    
    const product = products[0];
    console.log(`Testing with product: ${product.name} (ID: ${product.id})`);
    console.log(`Current brandId: ${product.brandId}`);
    
    // Get a brand to assign
    const [brands] = await connection.execute('SELECT id, name FROM brands LIMIT 1');
    
    if (brands.length === 0) {
      console.log('❌ No brands found to test with');
      return;
    }
    
    const brand = brands[0];
    console.log(`Assigning brand: ${brand.name} (ID: ${brand.id})`);
    
    // Update the product with brandId
    await connection.execute(
      'UPDATE products SET brandId = ? WHERE id = ?',
      [brand.id, product.id]
    );
    
    console.log('✅ Product updated with brandId');
    
    // Verify the update
    const [updatedProduct] = await connection.execute(
      'SELECT id, name, brandId FROM products WHERE id = ?',
      [product.id]
    );
    
    console.log(`Updated product brandId: ${updatedProduct[0].brandId}`);
    
    if (updatedProduct[0].brandId == brand.id) {
      console.log('✅ BrandId update successful!');
    } else {
      console.log('❌ BrandId update failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing product update:', error);
  } finally {
    await connection.end();
  }
}

testProductUpdate();
