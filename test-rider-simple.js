const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRider() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_DATABASE || 'drinks_db',
    });

    console.log('Connected to database successfully!');
    
    // Test inserting a rider
    const [result] = await connection.execute(
      'INSERT INTO riders (name, contact, cashLimit, isActive) VALUES (?, ?, ?, ?)',
      ['Test Rider', '+1234567890', 500.00, true]
    );
    
    console.log('Rider inserted successfully! ID:', result.insertId);
    
    // Test retrieving riders
    const [riders] = await connection.execute('SELECT * FROM riders');
    console.log('All riders:', riders);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRider();








