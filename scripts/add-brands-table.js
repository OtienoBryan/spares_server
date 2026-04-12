const mysql = require('mysql2/promise');
require('dotenv').config();

async function addBrandsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('Creating brands table...');
    
    // Create brands table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        logo VARCHAR(500),
        isActive BOOLEAN DEFAULT TRUE,
        website VARCHAR(500),
        country VARCHAR(100),
        foundedYear INT,
        categoryId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Brands table created successfully');

    // Add brandId column to products table
    console.log('Adding brandId column to products table...');
    
    try {
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN brandId INT NULL,
        ADD FOREIGN KEY (brandId) REFERENCES brands(id) ON DELETE SET NULL
      `);
      console.log('✅ brandId column added to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ brandId column already exists in products table');
      } else {
        throw error;
      }
    }

    // Populate brands table with data from products
    console.log('Populating brands table with data from products...');
    
    const [products] = await connection.execute(`
      SELECT DISTINCT brand, categoryId 
      FROM products 
      WHERE brand IS NOT NULL AND brand != ''
    `);

    console.log(`Found ${products.length} unique brands to add`);

    for (const product of products) {
      try {
        await connection.execute(`
          INSERT IGNORE INTO brands (name, categoryId, createdAt, updatedAt)
          VALUES (?, ?, NOW(), NOW())
        `, [product.brand, product.categoryId]);
      } catch (error) {
        console.log(`Warning: Could not insert brand "${product.brand}":`, error.message);
      }
    }

    // Update products table to link to brands
    console.log('Updating products to link to brands...');
    
    await connection.execute(`
      UPDATE products p
      JOIN brands b ON p.brand = b.name AND p.categoryId = b.categoryId
      SET p.brandId = b.id
    `);

    console.log('✅ Products linked to brands successfully');

    // Show summary
    const [brandCount] = await connection.execute('SELECT COUNT(*) as count FROM brands');
    const [linkedProducts] = await connection.execute('SELECT COUNT(*) as count FROM products WHERE brandId IS NOT NULL');
    
    console.log('\n📊 Summary:');
    console.log(`- Brands created: ${brandCount[0].count}`);
    console.log(`- Products linked: ${linkedProducts[0].count}`);

  } catch (error) {
    console.error('❌ Error creating brands table:', error);
  } finally {
    await connection.end();
  }
}

addBrandsTable();
