// Simple test to verify the admin service works with the new database schema
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAdminService() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_DATABASE || 'drinks_db',
  });

  try {
    console.log('🧪 Testing AdminService-like functionality...');
    
    // Simulate the admin service getAllProducts method
    console.log('📡 Simulating getAllProducts...');
    const [products] = await connection.execute(`
      SELECT 
        p.id, p.name, p.description, p.price, p.originalPrice, p.stock, 
        p.image, p.images, p.brand, p.brandId, p.alcoholContent, p.volume, 
        p.origin, p.tags, p.rating, p.reviewCount, p.isActive, p.isFeatured, 
        p.requiresAgeVerification, p.categoryId, p.subcategoryId, 
        p.createdAt, p.updatedAt,
        c.name as categoryName,
        b.name as brandName,
        s.name as subcategoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN subcategories s ON p.subcategoryId = s.id
      ORDER BY p.createdAt DESC
    `);
    
    console.log('✅ Products found:', products.length);
    
    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }
    
    const testProduct = products[0];
    console.log('📦 Test product with relations:', {
      id: testProduct.id,
      name: testProduct.name,
      brand: testProduct.brand,
      brandId: testProduct.brandId,
      brandName: testProduct.brandName,
      categoryName: testProduct.categoryName,
      subcategoryName: testProduct.subcategoryName
    });
    
    // Simulate the admin service updateProduct method
    console.log('🔄 Simulating updateProduct...');
    
    // Get a different brand to test with
    const [brands] = await connection.execute(`
      SELECT id, name FROM brands WHERE id != ? LIMIT 1
    `, [testProduct.brandId]);
    
    if (brands.length === 0) {
      console.log('❌ No alternative brand found');
      return;
    }
    
    const newBrand = brands[0];
    console.log('🎯 Testing with new brand:', newBrand);
    
    // Simulate the update logic from AdminService
    const productData = {
      brandId: newBrand.id,
      brand: newBrand.name
    };
    
    console.log('📤 Product data to update:', productData);
    
    // Update the product
    const updateResult = await connection.execute(`
      UPDATE products 
      SET brandId = ?, brand = ?, updatedAt = NOW()
      WHERE id = ?
    `, [productData.brandId, productData.brand, testProduct.id]);
    
    console.log('📊 Update result:', updateResult[0]);
    
    // Verify the update
    const [updatedProduct] = await connection.execute(`
      SELECT 
        p.id, p.name, p.brand, p.brandId, p.updatedAt,
        b.name as brandName
      FROM products p
      LEFT JOIN brands b ON p.brandId = b.id
      WHERE p.id = ?
    `, [testProduct.id]);
    
    console.log('✅ Updated product:', updatedProduct[0]);
    
    // Test the getProductById method
    console.log('📡 Simulating getProductById...');
    const [singleProduct] = await connection.execute(`
      SELECT 
        p.id, p.name, p.description, p.price, p.originalPrice, p.stock, 
        p.image, p.images, p.brand, p.brandId, p.alcoholContent, p.volume, 
        p.origin, p.tags, p.rating, p.reviewCount, p.isActive, p.isFeatured, 
        p.requiresAgeVerification, p.categoryId, p.subcategoryId, 
        p.createdAt, p.updatedAt,
        c.name as categoryName,
        b.name as brandName,
        s.name as subcategoryName
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN brands b ON p.brandId = b.id
      LEFT JOIN subcategories s ON p.subcategoryId = s.id
      WHERE p.id = ?
    `, [testProduct.id]);
    
    console.log('✅ Single product result:', singleProduct[0]);
    
  } catch (error) {
    console.error('❌ Error testing admin service:', error);
  } finally {
    await connection.end();
  }
}

testAdminService();
