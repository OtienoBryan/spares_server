// Simple script to start the server with hardcoded environment variables
process.env.PORT = '3001';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USERNAME = 'root';
process.env.DB_PASSWORD = '';
process.env.DB_DATABASE = 'drinks_db';
process.env.CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
process.env.CLOUDINARY_API_KEY = 'your_api_key';
process.env.CLOUDINARY_API_SECRET = 'your_api_secret';

// Import and start the server
require('./dist/main.js');
