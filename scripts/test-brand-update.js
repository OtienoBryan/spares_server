const mysql = require('mysql2/promise');
require('dotenv').config();

async function testBrandUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Testing brand and brandId update...');
    
    // Get a product to test with
    const [products] = await connection.execute('SELECT id, name, brand, brandId FROM products LIMIT 1');
    
    if (products.length === 0) {
      console.log('❌ No products found to test with');
      return;
    }
    
    const product = products[0];
    console.log(`Testing with product: ${product.name} (ID: ${product.id})`);
    console.log(`Current brand: "${product.brand}", brandId: ${product.brandId}`);
    
    // Get a brand to assign
    const [brands] = await connection.execute('SELECT id, name FROM brands LIMIT 1');
    
    if (brands.length === 0) {
      console.log('❌ No brands found to test with');
      return;
    }
    
    const brand = brands[0];
    console.log(`Assigning brand: "${brand.name}" (ID: ${brand.id})`);
    
    // Update the product with both brand and brandId
    await connection.execute(
      'UPDATE products SET brand = ?, brandId = ? WHERE id = ?',
      [brand.name, brand.id, product.id]
    );
    
    console.log('✅ Product updated with brand and brandId');
    
    // Verify the update
    const [updatedProduct] = await connection.execute(
      'SELECT id, name, brand, brandId FROM products WHERE id = ?',
      [product.id]
    );
    
    const updated = updatedProduct[0];
    console.log(`Updated product - brand: "${updated.brand}", brandId: ${updated.brandId}`);
    
    if (updated.brand === brand.name && updated.brandId == brand.id) {
      console.log('✅ Both brand and brandId update successful!');
    } else {
      console.log('❌ Brand/brandId update failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing brand update:', error);
  } finally {
    await connection.end();
  }
}

testBrandUpdate();
