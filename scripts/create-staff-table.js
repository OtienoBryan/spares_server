const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createStaffTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'drinks_db',
    });

    console.log('Connected to database');

    // Create staff table
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

    console.log('Staff table created or already exists');

    // Check if admin user exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM staff WHERE email = ?',
      ['admin@drinks.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        `INSERT INTO staff (email, password, firstName, lastName, role, isActive) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin@drinks.com', hashedPassword, 'Admin', 'User', 'admin', true]
      );

      console.log('Default admin user created:');
      console.log('Email: admin@drinks.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Staff table setup completed successfully');
  } catch (error) {
    console.error('Error setting up staff table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createStaffTable()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
