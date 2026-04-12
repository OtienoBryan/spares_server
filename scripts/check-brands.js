const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBrands() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Checking brands table...');
    
    // Check if brands table exists
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'brands'
    `, [process.env.DB_DATABASE || 'drinks_db']);

    if (tables.length === 0) {
      console.log('❌ Brands table does not exist');
      return;
    }

    console.log('✅ Brands table exists');

    // Check brands data
    const [brands] = await connection.execute('SELECT * FROM brands ORDER BY id');
    
    console.log(`\n📋 Found ${brands.length} brands:`);
    brands.forEach(brand => {
      console.log(`  - ID: ${brand.id}, Name: "${brand.name}", Category ID: ${brand.categoryId}, Active: ${brand.isActive}`);
    });

    // Check if products table has brandId column
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'brandId'
    `, [process.env.DB_DATABASE || 'drinks_db']);

    if (columns.length === 0) {
      console.log('\n❌ Products table does not have brandId column');
    } else {
      console.log('\n✅ Products table has brandId column');
      
      // Check products with brandId
      const [productsWithBrand] = await connection.execute(`
        SELECT p.id, p.name, p.brand, p.brandId, b.name as brandName 
        FROM products p 
        LEFT JOIN brands b ON p.brandId = b.id 
        WHERE p.brandId IS NOT NULL 
        LIMIT 10
      `);
      
      console.log(`\n📦 Products with brandId (showing first 10):`);
      productsWithBrand.forEach(product => {
        console.log(`  - Product: "${product.name}", Brand: "${product.brand}", BrandId: ${product.brandId}, BrandName: "${product.brandName}"`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking brands:', error);
  } finally {
    await connection.end();
  }
}

checkBrands();
