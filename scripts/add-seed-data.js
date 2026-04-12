const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function addSeedData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Adding additional seed data...');
    
    // Clear existing data first
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM order_items');
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM cart_items');
    await connection.execute('DELETE FROM carts');
    await connection.execute('DELETE FROM products');
    await connection.execute('DELETE FROM users');
    await connection.execute('DELETE FROM categories');
    
    // Reset auto-increment counters
    await connection.execute('ALTER TABLE categories AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE products AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE carts AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE orders AUTO_INCREMENT = 1');
    
    // Read and execute seed data
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    
    const seedStatements = seed.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Seed data added successfully!');
    
    // Show summary
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [carts] = await connection.execute('SELECT COUNT(*) as count FROM carts');
    const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    
    console.log('\n📊 Database Summary:');
    console.log(`   Categories: ${categories[0].count}`);
    console.log(`   Products: ${products[0].count}`);
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Carts: ${carts[0].count}`);
    console.log(`   Orders: ${orders[0].count}`);
    
  } catch (error) {
    console.error('❌ Error adding seed data:', error.message);
  } finally {
    await connection.end();
  }
}

addSeedData();
