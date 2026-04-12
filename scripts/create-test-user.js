const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function createTestUser() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || process.env.DB_NAME || 'drinks_db',
    });

    console.log('Connected to database');

    // Check if staff table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'staff'"
    );

    if (tables.length === 0) {
      console.log('Staff table does not exist. Creating it...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS staff (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
          isActive BOOLEAN DEFAULT TRUE,
          lastLogin DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Staff table created');
    }

    // Test user credentials
    const testEmail = 'test@admin.com';
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Check if test user already exists
    const [existingUser] = await connection.execute(
      'SELECT id, email FROM staff WHERE email = ?',
      [testEmail]
    );

    if (existingUser.length > 0) {
      // Update existing user
      await connection.execute(
        `UPDATE staff 
         SET password = ?, firstName = ?, lastName = ?, role = ?, isActive = ?
         WHERE email = ?`,
        [hashedPassword, 'Test', 'Admin', 'admin', true, testEmail]
      );
      console.log('\n✅ Test user updated successfully!');
    } else {
      // Create new test user
      await connection.execute(
        `INSERT INTO staff (email, password, firstName, lastName, role, isActive) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [testEmail, hashedPassword, 'Test', 'Admin', 'admin', true]
      );
      console.log('\n✅ Test user created successfully!');
    }

    console.log('\n📋 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`Role:     admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTestUser()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
