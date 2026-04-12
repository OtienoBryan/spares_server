const mysql = require('mysql2/promise');
require('dotenv').config();

async function removeSubcategoryImageColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Removing image column from subcategories table...');
    
    // Check if the image column exists before trying to drop it
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'subcategories' AND COLUMN_NAME = 'image'
    `, [process.env.DB_DATABASE || 'drinks_db']);

    if (columns.length > 0) {
      // Remove the image column
      await connection.execute(`
        ALTER TABLE subcategories DROP COLUMN image
      `);
      console.log('✅ Image column removed from subcategories table');
    } else {
      console.log('ℹ️  Image column does not exist in subcategories table');
    }

    // Show the updated table structure
    const [tableStructure] = await connection.execute(`
      DESCRIBE subcategories
    `);
    
    console.log('\n📋 Updated subcategories table structure:');
    tableStructure.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? '(nullable)' : '(not null)'}`);
    });

  } catch (error) {
    console.error('❌ Error removing image column:', error);
  } finally {
    await connection.end();
  }
}

removeSubcategoryImageColumn();
