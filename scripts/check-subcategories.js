const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSubcategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Checking subcategories in database...');
    
    // Get all subcategories
    const [subcategories] = await connection.execute(`
      SELECT s.*, c.name as categoryName 
      FROM subcategories s 
      LEFT JOIN categories c ON s.categoryId = c.id 
      ORDER BY s.categoryId, s.name
    `);
    
    console.log(`\n📋 Found ${subcategories.length} subcategories:`);
    subcategories.forEach(sub => {
      console.log(`  - ID: ${sub.id}, Name: "${sub.name}", Category: "${sub.categoryName}" (ID: ${sub.categoryId}), Active: ${sub.isActive}`);
    });

    // Group by category
    const byCategory = {};
    subcategories.forEach(sub => {
      if (!byCategory[sub.categoryId]) {
        byCategory[sub.categoryId] = [];
      }
      byCategory[sub.categoryId].push(sub);
    });

    console.log('\n📊 Subcategories by category:');
    Object.keys(byCategory).forEach(categoryId => {
      const categoryName = byCategory[categoryId][0].categoryName;
      console.log(`  Category ${categoryId} (${categoryName}): ${byCategory[categoryId].length} subcategories`);
      byCategory[categoryId].forEach(sub => {
        console.log(`    - ${sub.name}`);
      });
    });

  } catch (error) {
    console.error('❌ Error checking subcategories:', error);
  } finally {
    await connection.end();
  }
}

checkSubcategories();
