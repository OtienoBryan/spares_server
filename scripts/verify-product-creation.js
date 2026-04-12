const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyProductCreation() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Verifying product creation with brand...');
    
    // Get the most recent product
    const [products] = await connection.execute(`
      SELECT id, name, description, price, brand, brandId, categoryId, createdAt 
      FROM products 
      ORDER BY id DESC 
      LIMIT 1
    `);
    
    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }
    
    const product = products[0];
    console.log('Most recent product:');
    console.log(`  ID: ${product.id}`);
    console.log(`  Name: ${product.name}`);
    console.log(`  Description: ${product.description}`);
    console.log(`  Price: ${product.price}`);
    console.log(`  Brand: "${product.brand}"`);
    console.log(`  BrandId: ${product.brandId}`);
    console.log(`  CategoryId: ${product.categoryId}`);
    console.log(`  Created: ${product.createdAt}`);
    
    if (product.brand && product.brandId) {
      console.log('✅ Product created with both brand and brandId!');
    } else {
      console.log('❌ Product missing brand information');
    }
    
  } catch (error) {
    console.error('❌ Error verifying product:', error);
  } finally {
    await connection.end();
  }
}

verifyProductCreation();
