-- Use existing database
USE impulsep_drinks;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    originalPrice DECIMAL(10,2),
    stock INT DEFAULT 0,
    image VARCHAR(500),
    images JSON,
    brand VARCHAR(255),
    alcoholContent VARCHAR(50),
    volume VARCHAR(50),
    origin VARCHAR(255),
    tags JSON,
    rating DECIMAL(3,2) DEFAULT 0,
    reviewCount INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT FALSE,
    isPopularWine BOOLEAN DEFAULT FALSE,
    requiresAgeVerification BOOLEAN DEFAULT FALSE,
    categoryId INT NOT NULL,
    vehicleModelId INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id) ON DELETE SET NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dateOfBirth DATE,
    isActive BOOLEAN DEFAULT TRUE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    emailVerificationToken VARCHAR(255),
    passwordResetToken VARCHAR(255),
    passwordResetExpires TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalAmount DECIMAL(10,2) DEFAULT 0,
    totalItems INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderNumber VARCHAR(255) UNIQUE NOT NULL,
    userId INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'assigned', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shippingAddress TEXT,
    billingAddress TEXT,
    notes TEXT,
    riderId INT NULL,
    assignedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (riderId) REFERENCES riders(id) ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    cashLimit DECIMAL(10,2) DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create vehicle makes table
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo VARCHAR(500) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create vehicle models table
CREATE TABLE IF NOT EXISTS vehicle_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    makeId INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (makeId) REFERENCES vehicle_makes(id) ON DELETE SET NULL
);

-- Create vehicle years table
CREATE TABLE IF NOT EXISTS vehicle_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    yearFrom INT NOT NULL,
    yearTo INT NULL,
    modelId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_vehicle_year_range_model (yearFrom, yearTo, modelId),
    FOREIGN KEY (modelId) REFERENCES vehicle_models(id) ON DELETE CASCADE
);

-- Product ↔ vehicle year junction
CREATE TABLE IF NOT EXISTS product_vehicle_years (
    productId INT NOT NULL,
    vehicleYearId INT NOT NULL,
    PRIMARY KEY (productId, vehicleYearId),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicleYearId) REFERENCES vehicle_years(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_active ON products(isActive);
CREATE INDEX idx_products_featured ON products(isFeatured);
CREATE INDEX idx_products_popular_wine ON products(isPopularWine);
CREATE INDEX idx_products_vehicle_model ON products(vehicleModelId);
CREATE INDEX idx_cart_items_cart ON cart_items(cartId);
CREATE INDEX idx_cart_items_product ON cart_items(productId);
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_rider ON orders(riderId);
CREATE INDEX idx_order_items_order ON order_items(orderId);
CREATE INDEX idx_order_items_product ON order_items(productId);
CREATE INDEX idx_riders_active ON riders(isActive);
CREATE INDEX idx_vehicle_models_name ON vehicle_models(name);
CREATE INDEX idx_vehicle_makes_name ON vehicle_makes(name);
