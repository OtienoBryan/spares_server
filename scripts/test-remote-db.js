const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRemoteDatabase() {
  console.log('🌐 Testing Remote Database Connection');
  console.log('====================================');
  console.log('');
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Username: ${process.env.DB_USERNAME}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`   Database: ${process.env.DB_DATABASE}`);
  console.log('');

  // Test 1: Basic connection
  console.log('🧪 Test 1: Basic Connection');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectTimeout: 10000, // 10 seconds timeout
      acquireTimeout: 10000,
      timeout: 10000,
    });

    console.log('   ✅ Connection successful!');
    
    // Test 2: Check if database exists
    console.log('');
    console.log('🧪 Test 2: Database Access');
    await connection.execute(`USE ${process.env.DB_DATABASE}`);
    console.log(`   ✅ Successfully connected to database '${process.env.DB_DATABASE}'`);
    
    // Test 3: Check tables
    console.log('');
    console.log('🧪 Test 3: Table Structure');
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log(`   ✅ Found ${tables.length} tables:`);
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        console.log(`      - ${tableName}`);
      }
    } else {
      console.log('   ⚠️  No tables found. Database is empty.');
      console.log('   💡 Run: npm run db:setup');
    }

    await connection.end();
    console.log('');
    console.log('✅ All tests passed! Database is ready.');
    
  } catch (error) {
    console.log('   ❌ Connection failed!');
    console.log('');
    console.log('🔧 Troubleshooting Guide:');
    console.log('========================');
    
    switch (error.code) {
      case 'ECONNREFUSED':
        console.log('❌ Connection refused by server');
        console.log('💡 Possible causes:');
        console.log('   1. MySQL server is not running on the remote host');
        console.log('   2. Firewall is blocking port 3306');
        console.log('   3. MySQL is not configured to accept remote connections');
        console.log('   4. Wrong host/port combination');
        break;
        
      case 'ETIMEDOUT':
        console.log('❌ Connection timeout');
        console.log('💡 Possible causes:');
        console.log('   1. Network connectivity issues');
        console.log('   2. Firewall blocking the connection');
        console.log('   3. Server is overloaded');
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('❌ Access denied');
        console.log('💡 Possible causes:');
        console.log('   1. Wrong username or password');
        console.log('   2. User does not have remote access privileges');
        console.log('   3. User can only connect from specific IP addresses');
        break;
        
      case 'ER_BAD_DB_ERROR':
        console.log('❌ Database does not exist');
        console.log('💡 Solution: Create the database first');
        break;
        
      default:
        console.log(`❌ Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
    }
    
    console.log('');
    console.log('📝 Next Steps:');
    console.log('1. Verify the database server is running');
    console.log('2. Check if the user has remote access privileges');
    console.log('3. Ensure firewall allows connections on port 3306');
    console.log('4. Contact your database administrator if needed');
  }
}

testRemoteDatabase();
