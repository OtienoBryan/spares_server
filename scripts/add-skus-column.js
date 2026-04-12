const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSkusColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'impulsep_drinks',
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('Adding skus column to products table...');
    
    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'skus'
    `, [process.env.DB_NAME || 'impulsep_drinks']);
    
    if (columns.length > 0) {
      console.log('⚠️  skus column already exists');
      return;
    }
    
    // Add the skus column
    await connection.execute(`
      ALTER TABLE products 
      ADD COLUMN skus JSON NULL
    `);
    
    console.log('✅ skus column added successfully');
    
    // Verify the column was added
    const [verify] = await connection.execute(`
      DESCRIBE products
    `);
    
    const skusColumn = verify.find(col => col.Field === 'skus');
    if (skusColumn) {
      console.log('✅ Verified: skus column exists');
      console.log('   Column details:', {
        Field: skusColumn.Field,
        Type: skusColumn.Type,
        Null: skusColumn.Null,
        Default: skusColumn.Default
      });
    }
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  skus column already exists');
    } else {
      console.error('❌ Error adding skus column:', error.message);
      throw error;
    }
  } finally {
    await connection.end();
  }
}

addSkusColumn();
