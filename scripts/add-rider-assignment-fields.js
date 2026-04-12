const mysql = require('mysql2/promise');
require('dotenv').config();

async function addRiderAssignmentFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Adding rider assignment fields to orders table...');
    
    // Add riderId column
    await connection.execute(`
      ALTER TABLE orders 
      ADD COLUMN riderId INT NULL,
      ADD COLUMN assignedAt TIMESTAMP NULL
    `);
    console.log('✅ Added riderId and assignedAt columns');
    
    // Add foreign key constraint
    await connection.execute(`
      ALTER TABLE orders 
      ADD CONSTRAINT fk_orders_rider 
      FOREIGN KEY (riderId) REFERENCES riders(id) ON DELETE SET NULL
    `);
    console.log('✅ Added foreign key constraint');
    
    // Add index for riderId
    await connection.execute(`
      CREATE INDEX idx_orders_rider ON orders(riderId)
    `);
    console.log('✅ Added index for riderId');
    
    // Update status enum to include 'assigned'
    await connection.execute(`
      ALTER TABLE orders 
      MODIFY COLUMN status ENUM('pending', 'assigned', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending'
    `);
    console.log('✅ Updated status enum to include assigned');
    
    console.log('🎉 Rider assignment fields added successfully!');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Fields already exist, skipping...');
    } else if (error.code === 'ER_DUP_KEYNAME') {
      console.log('✅ Index already exists, skipping...');
    } else {
      console.error('❌ Error adding rider assignment fields:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addRiderAssignmentFields();








