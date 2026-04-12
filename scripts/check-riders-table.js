const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkRidersTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Checking if riders table exists...');
    
    const [rows] = await connection.execute('SHOW TABLES LIKE "riders"');
    
    if (rows.length > 0) {
      console.log('✅ Riders table exists!');
      
      // Check table structure
      const [columns] = await connection.execute('DESCRIBE riders');
      console.log('Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
      });
    } else {
      console.log('❌ Riders table does not exist');
    }
    
  } catch (error) {
    console.error('Error checking riders table:', error);
  } finally {
    await connection.end();
  }
}

checkRidersTable();

