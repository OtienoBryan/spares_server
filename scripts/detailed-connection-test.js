const mysql = require('mysql2/promise');
require('dotenv').config();

async function detailedConnectionTest() {
  console.log('🔍 Detailed MySQL Connection Test');
  console.log('================================');
  console.log('');

  // Display current configuration
  console.log('📋 Current Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   Username: ${process.env.DB_USERNAME || 'root'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'NOT SET'}`);
  console.log(`   Database: ${process.env.DB_DATABASE || 'drinks_db'}`);
  console.log('');

  // Test 1: Basic connection without database
  console.log('🧪 Test 1: Basic MySQL Connection');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'your_password',
    });

    console.log('   ✅ Basic connection successful!');
    
    // Test MySQL version
    const [version] = await connection.execute('SELECT VERSION() as version');
    console.log(`   📊 MySQL Version: ${version[0].version}`);
    
    // Test 2: Check if database exists
    console.log('');
    console.log('🧪 Test 2: Database Existence Check');
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbName = process.env.DB_DATABASE || 'drinks_db';
    const dbExists = databases.some(db => db.Database === dbName);
    
    if (dbExists) {
      console.log(`   ✅ Database '${dbName}' exists!`);
      
      // Test 3: Connect to specific database
      console.log('');
      console.log('🧪 Test 3: Database Access');
      await connection.execute(`USE ${dbName}`);
      console.log(`   ✅ Successfully connected to '${dbName}'`);
      
      // Test 4: Check tables
      console.log('');
      console.log('🧪 Test 4: Table Structure Check');
      const [tables] = await connection.execute('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log(`   ✅ Found ${tables.length} tables:`);
        for (const table of tables) {
          const tableName = Object.values(table)[0];
          console.log(`      - ${tableName}`);
        }
        
        // Test 5: Sample data query
        console.log('');
        console.log('🧪 Test 5: Sample Data Query');
        try {
          const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
          console.log(`   ✅ Categories table: ${categories[0].count} records`);
          
          const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
          console.log(`   ✅ Products table: ${products[0].count} records`);
          
        } catch (queryError) {
          console.log(`   ⚠️  Query error: ${queryError.message}`);
        }
        
      } else {
        console.log('   ⚠️  No tables found. Database is empty.');
        console.log('   💡 Run: npm run db:setup');
      }
      
    } else {
      console.log(`   ❌ Database '${dbName}' does not exist!`);
      console.log('   💡 Run: npm run db:setup');
    }

    await connection.end();
    console.log('');
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.log('   ❌ Connection failed!');
    console.log('');
    console.log('🔧 Troubleshooting Guide:');
    console.log('========================');
    
    switch (error.code) {
      case 'ECONNREFUSED':
        console.log('❌ MySQL server is not running');
        console.log('💡 Solutions:');
        console.log('   1. Start MySQL service:');
        console.log('      - Windows: net start mysql');
        console.log('      - macOS: brew services start mysql');
        console.log('      - Linux: sudo systemctl start mysql');
        console.log('   2. Check if MySQL is installed');
        console.log('   3. Verify the port number (default: 3306)');
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('❌ Access denied - Wrong credentials');
        console.log('💡 Solutions:');
        console.log('   1. Check username and password in .env file');
        console.log('   2. Verify MySQL user has proper permissions');
        console.log('   3. Try connecting with MySQL Workbench or command line');
        break;
        
      case 'ENOTFOUND':
        console.log('❌ Host not found');
        console.log('💡 Solutions:');
        console.log('   1. Check if hostname is correct');
        console.log('   2. Try using "localhost" or "127.0.0.1"');
        break;
        
      case 'ETIMEDOUT':
        console.log('❌ Connection timeout');
        console.log('💡 Solutions:');
        console.log('   1. Check if MySQL is running on the specified port');
        console.log('   2. Check firewall settings');
        console.log('   3. Verify network connectivity');
        break;
        
      default:
        console.log(`❌ Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        console.log('💡 Check MySQL server status and configuration');
    }
    
    console.log('');
    console.log('📝 Next Steps:');
    console.log('1. Fix the connection issue above');
    console.log('2. Run: npm run db:test');
    console.log('3. Once connected, run: npm run db:setup');
  }
}

detailedConnectionTest();
