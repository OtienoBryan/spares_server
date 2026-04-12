const mysql = require('mysql2/promise');
require('dotenv').config();

async function testBrandUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🧪 Testing brand update functionality...');
    
    // Check if brandId column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'brandId'
    `);
    
    console.log('📋 brandId column info:', columns);
    
    // Check if subcategoryId column exists
    const [subColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'subcategoryId'
    `);
    
    console.log('📋 subcategoryId column info:', subColumns);
    
    // Get a sample product to test with
    const [products] = await connection.execute(`
      SELECT id, name, brand, brandId, subcategoryId 
      FROM products 
      LIMIT 1
    `);
    
    if (products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }
    
    const testProduct = products[0];
    console.log('📦 Test product:', testProduct);
    
    // Get available brands
    const [brands] = await connection.execute('SELECT id, name FROM brands LIMIT 5');
    console.log('🏷️ Available brands:', brands);
    
    if (brands.length === 0) {
      console.log('❌ No brands found in database');
      return;
    }
    
    const testBrand = brands[0];
    console.log('🎯 Testing with brand:', testBrand);
    
    // Test direct database update
    console.log('🔄 Testing direct database update...');
    const updateResult = await connection.execute(`
      UPDATE products 
      SET brandId = ?, brand = ?
      WHERE id = ?
    `, [testBrand.id, testBrand.name, testProduct.id]);
    
    console.log('📊 Update result:', updateResult);
    
    // Verify the update
    const [updatedProduct] = await connection.execute(`
      SELECT id, name, brand, brandId, subcategoryId 
      FROM products 
      WHERE id = ?
    `, [testProduct.id]);
    
    console.log('✅ Updated product:', updatedProduct[0]);
    
    // Test with different brand
    if (brands.length > 1) {
      const testBrand2 = brands[1];
      console.log('🔄 Testing with second brand:', testBrand2);
      
      const updateResult2 = await connection.execute(`
        UPDATE products 
        SET brandId = ?, brand = ?
        WHERE id = ?
      `, [testBrand2.id, testBrand2.name, testProduct.id]);
      
      console.log('📊 Second update result:', updateResult2);
      
      const [finalProduct] = await connection.execute(`
        SELECT id, name, brand, brandId, subcategoryId 
        FROM products 
        WHERE id = ?
      `, [testProduct.id]);
      
      console.log('✅ Final product:', finalProduct[0]);
    }
    
  } catch (error) {
    console.error('❌ Error testing brand update:', error);
  } finally {
    await connection.end();
  }
}

testBrandUpdate();