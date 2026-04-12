er
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRiderInsert() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Testing rider insertion...');
    
    // Test inserting a rider
    const [result] = await connection.execute(
      'INSERT INTO riders (name, contact, cashLimit, isActive) VALUES (?, ?, ?, ?)',
      ['John Doe', '+1234567890', 1000.00, true]  
    );
    
    console.log('✅ Rider inserted successfully!');
    console.log('Insert ID:', result.insertId);
    
    // Test retrieving riders
    const [riders] = await connection.execute('SELECT * FROM riders');
    console.log('📋 All riders:');
    riders.forEach(rider => {
      console.log(`  - ID: ${rider.id}, Name: ${rider.name}, Contact: ${rider.contact}, Cash Limit: $${rider.cashLimit}, Active: ${rider.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing rider insertion:', error);
  } finally {
    await connection.end();
  }
}

testRiderInsert();
