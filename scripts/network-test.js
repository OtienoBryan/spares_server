const net = require('net');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testNetworkConnectivity() {
  console.log('🔍 Network Connectivity Test');
  console.log('============================');
  console.log(`Testing connection to: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log('');

  // Test 1: Basic TCP connection
  console.log('🧪 Test 1: TCP Port Connectivity');
  try {
    await new Promise((resolve, reject) => {
      const socket = new net.Socket();
      const timeout = 5000;
      
      socket.setTimeout(timeout);
      
      socket.on('connect', () => {
        console.log('   ✅ TCP connection successful!');
        socket.destroy();
        resolve();
      });
      
      socket.on('timeout', () => {
        console.log('   ❌ Connection timeout');
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
      
      socket.on('error', (err) => {
        console.log('   ❌ TCP connection failed:', err.message);
        socket.destroy();
        reject(err);
      });
      
      socket.connect(process.env.DB_PORT, process.env.DB_HOST);
    });
  } catch (error) {
    console.log('   ❌ Cannot reach the server');
    console.log('   💡 Possible causes:');
    console.log('      - Server is down');
    console.log('      - Firewall blocking port 3306');
    console.log('      - Wrong host/port');
    console.log('      - Network connectivity issues');
    return;
  }

  // Test 2: MySQL connection with different configurations
  console.log('');
  console.log('🧪 Test 2: MySQL Connection Tests');
  
  const configs = [
    {
      name: 'Standard Connection',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectTimeout: 10000,
      }
    },
    {
      name: 'Connection with SSL Disabled',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        ssl: false,
        connectTimeout: 10000,
      }
    },
    {
      name: 'Connection without Database',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectTimeout: 10000,
      }
    }
  ];

  for (const test of configs) {
    try {
      console.log(`   Testing: ${test.name}`);
      const connection = await mysql.createConnection(test.config);
      console.log(`   ✅ ${test.name} - Success!`);
      
      // Try to use the database
      if (test.config.database !== false) {
        await connection.execute(`USE ${process.env.DB_DATABASE}`);
        console.log(`   ✅ Database '${process.env.DB_DATABASE}' accessible`);
      }
      
      await connection.end();
      console.log('   ✅ All MySQL tests passed!');
      return;
      
    } catch (error) {
      console.log(`   ❌ ${test.name} - Failed: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
    }
  }

  console.log('');
  console.log('🔧 Troubleshooting Recommendations:');
  console.log('===================================');
  console.log('1. Contact your hosting provider to verify:');
  console.log('   - MySQL server is running');
  console.log('   - Port 3306 is open');
  console.log('   - Remote connections are allowed');
  console.log('');
  console.log('2. Check MySQL configuration:');
  console.log('   - bind-address should be 0.0.0.0 (not 127.0.0.1)');
  console.log('   - skip-networking should be disabled');
  console.log('');
  console.log('3. Verify user permissions:');
  console.log('   - User should have remote access privileges');
  console.log('   - Check if user is restricted to specific IPs');
  console.log('');
  console.log('4. Test with MySQL client:');
  console.log(`   mysql -h ${process.env.DB_HOST} -P ${process.env.DB_PORT} -u ${process.env.DB_USERNAME} -p`);
}

testNetworkConnectivity();
