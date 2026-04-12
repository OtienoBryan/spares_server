# Staff Authentication Setup

This guide explains how to set up the staff authentication system for the admin panel.

## Prerequisites

1. Install required npm packages:
```bash
npm install bcrypt @nestjs/jwt @types/bcrypt
```

2. Make sure your database is running and accessible.

## Database Setup

### Option 1: Using the Setup Script (Recommended)

Run the setup script to create the staff table and default admin user:

```bash
node scripts/create-staff-table.js
```

This will:
- Create the `staff` table if it doesn't exist
- Create a default admin user with:
  - Email: `admin@drinks.com`
  - Password: `admin123`
  - Role: `admin`

### Option 2: Manual Database Setup

If you prefer to set up manually, run this SQL:

```sql
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

To create the default admin user, hash the password using bcrypt (password: `admin123`) and insert:

```sql
INSERT INTO staff (email, password, firstName, lastName, role, isActive) 
VALUES ('admin@drinks.com', '<hashed_password>', 'Admin', 'User', 'admin', TRUE);
```

## Environment Variables

Add to your `.env` file:

```
JWT_SECRET=your-secret-key-change-in-production
```

**Important**: Change the JWT_SECRET to a strong, random string in production!

## API Endpoints

### Login
- **POST** `/api/auth/admin/login`
- Body: `{ "email": "admin@drinks.com", "password": "admin123" }`
- Returns: `{ "token": "...", "user": { ... } }`

### Validate Token
- **POST** `/api/auth/admin/validate`
- Body: `{ "token": "..." }`
- Returns: `{ "user": { ... } }`

### Get Current User
- **GET** `/api/auth/admin/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ "id": 1, "email": "...", ... }`

## Staff Roles

- **admin**: Full access to all admin features
- **manager**: Limited admin access (can be customized)
- **staff**: Basic staff access (can be customized)

## Security Notes

1. Passwords are hashed using bcrypt with salt rounds of 10
2. JWT tokens expire after 24 hours
3. Always use HTTPS in production
4. Change default admin credentials after first login
5. Use strong JWT secrets in production

## Troubleshooting

### "Invalid credentials" error
- Check that the staff user exists in the database
- Verify the password is correct
- Ensure the account is active (`isActive = TRUE`)

### "No token provided" error
- Make sure you're sending the token in the Authorization header
- Format: `Authorization: Bearer <token>`

### Database connection errors
- Verify your database credentials in `.env`
- Ensure the database server is running
- Check that the `staff` table exists
