# Database Setup Instructions

## Prerequisites

1. MySQL Server installed and running
2. Node.js and npm installed
3. Environment variables configured

## Environment Configuration

Make sure your `.env` file contains the correct database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=drinks_db
```

## Database Setup

### Option 1: Using the setup script (Recommended)

```bash
npm run db:setup
```

This will:
- Create the `drinks_db` database
- Create all necessary tables
- Insert sample data

### Option 2: Manual setup

1. Create the database:
```sql
CREATE DATABASE drinks_db;
```

2. Run the schema file:
```bash
mysql -u root -p drinks_db < database/schema.sql
```

3. Run the seed file:
```bash
mysql -u root -p drinks_db < database/seed.sql
```

## Database Schema

The database includes the following tables:

- **categories**: Product categories (Beer, Wine, Whiskey, etc.)
- **products**: Drink products with details like price, stock, alcohol content
- **users**: Customer information
- **carts**: Shopping carts
- **cart_items**: Items in shopping carts
- **orders**: Customer orders
- **order_items**: Items in orders

## Sample Data

The database is seeded with:
- 8 product categories
- 8 sample products
- 2 sample users
- Sample cart and order data

## Resetting the Database

To reset the database with fresh data:

```bash
npm run db:reset
```

## Troubleshooting

1. **Connection Error**: Check your MySQL credentials in `.env`
2. **Permission Error**: Ensure your MySQL user has CREATE and DROP privileges
3. **Port Error**: Make sure MySQL is running on the specified port (default: 3306)

## Development Notes

- The database uses `synchronize: true` in development mode
- All tables have proper foreign key constraints
- Indexes are created for better query performance
- Timestamps are automatically managed
