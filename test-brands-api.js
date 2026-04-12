const mysql = require('mysql2/promise');
require('dotenv').config();

async function testBrandsAPI() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🧪 Testing Brands API...');
    
    // Check if brands table exists and has data
    console.log('📡 Checking brands table...');
    const [brands] = await connection.execute('SELECT * FROM brands LIMIT 10');
    console.log('✅ Brands found:', brands.length);
    console.log('📋 Sample brands:', brands.map(b => ({ id: b.id, name: b.name })));
    
    if (brands.length === 0) {
      console.log('❌ No brands found in database');
      console.log('🔧 Creating sample brands...');
      
      // Create some sample brands
      const sampleBrands = [
        { name: 'Sample Brand 1', description: 'Test brand 1', categoryId: 1 },
        { name: 'Sample Brand 2', description: 'Test brand 2', categoryId: 2 },
        { name: 'Sample Brand 3', description: 'Test brand 3', categoryId: 3 },
      ];
      
      for (const brand of sampleBrands) {
        await connection.execute(
          'INSERT INTO brands (name, description, categoryId, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [brand.name, brand.description, brand.categoryId, true]
        );
        console.log(`✅ Created brand: ${brand.name}`);
      }
      
      // Check brands again
      const [newBrands] = await connection.execute('SELECT * FROM brands LIMIT 10');
      console.log('✅ Brands after creation:', newBrands.length);
      console.log('📋 New brands:', newBrands.map(b => ({ id: b.id, name: b.name })));
    }
    
  } catch (error) {
    console.error('❌ Error testing brands API:', error);
  } finally {
    await connection.end();
  }
}

testBrandsAPI();
