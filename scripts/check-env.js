require('dotenv').config();

console.log('Environment Variables Check:');
console.log('============================');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('');

// Test MySQL connection with the loaded variables
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing connection with loaded variables...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Error code:', error.code);
  }
}

testConnection();
