const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSubcategoriesTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Adding subcategories table...');
    
    // Create subcategories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        isActive BOOLEAN DEFAULT TRUE,
        categoryId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
        INDEX idx_categoryId (categoryId),
        INDEX idx_isActive (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add subcategoryId column to products table if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN subcategoryId INT NULL,
        ADD FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE SET NULL
      `);
      console.log('✅ Added subcategoryId column to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  subcategoryId column already exists in products table');
      } else {
        throw error;
      }
    }

    console.log('✅ Subcategories table created successfully!');
    
    // Insert some sample subcategories
    const sampleSubcategories = [
      { name: 'Red Wine', description: 'Full-bodied red wines', categoryId: 1 },
      { name: 'White Wine', description: 'Crisp white wines', categoryId: 1 },
      { name: 'Rosé Wine', description: 'Pink wines', categoryId: 1 },
      { name: 'Lager', description: 'Light lagers', categoryId: 2 },
      { name: 'Ale', description: 'Craft ales', categoryId: 2 },
      { name: 'Stout', description: 'Dark stouts', categoryId: 2 },
      { name: 'Whiskey', description: 'Premium whiskeys', categoryId: 3 },
      { name: 'Vodka', description: 'Clear spirits', categoryId: 3 },
      { name: 'Gin', description: 'Botanical gins', categoryId: 3 },
    ];

    for (const sub of sampleSubcategories) {
      try {
        await connection.execute(
          'INSERT INTO subcategories (name, description, categoryId) VALUES (?, ?, ?)',
          [sub.name, sub.description, sub.categoryId]
        );
        console.log(`✅ Added subcategory: ${sub.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Subcategory ${sub.name} already exists`);
        } else {
          console.error(`❌ Error adding subcategory ${sub.name}:`, error.message);
        }
      }
    }

    // Show the created subcategories
    const [subcategories] = await connection.execute(`
      SELECT s.*, c.name as categoryName 
      FROM subcategories s 
      JOIN categories c ON s.categoryId = c.id 
      ORDER BY c.name, s.name
    `);
    
    console.log('\n📋 Created subcategories:');
    subcategories.forEach(sub => {
      console.log(`  - ${sub.name} (${sub.categoryName})`);
    });

  } catch (error) {
    console.error('❌ Error setting up subcategories:', error);
  } finally {
    await connection.end();
  }
}

addSubcategoriesTable();
