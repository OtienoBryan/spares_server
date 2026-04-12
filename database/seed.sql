-- Insert sample categories
INSERT INTO categories (name, description, image, isActive) VALUES
('Beer', 'Craft beers, lagers, ales, and stouts', '/images/categories/beer.jpg', TRUE),
('Wine', 'Red wines, white wines, rosé, and sparkling wines', '/images/categories/wine.jpg', TRUE),
('Whiskey', 'Scotch, bourbon, Irish whiskey, and more', '/images/categories/whiskey.jpg', TRUE),
('Vodka', 'Premium vodkas from around the world', '/images/categories/vodka.jpg', TRUE),
('Rum', 'White, dark, and spiced rums', '/images/categories/rum.jpg', TRUE),
('Gin', 'London dry gin, craft gin, and flavored gin', '/images/categories/gin.jpg', TRUE),
('Tequila', 'Blanco, reposado, and añejo tequilas', '/images/categories/tequila.jpg', TRUE),
('Liqueurs', 'Sweet liqueurs and digestifs', '/images/categories/liqueurs.jpg', TRUE);

-- Insert sample products
INSERT INTO products (name, description, price, originalPrice, stock, image, brand, alcoholContent, volume, origin, tags, rating, reviewCount, isActive, isFeatured, requiresAgeVerification, categoryId) VALUES
-- Beer Products
('Craft IPA Beer', 'A hoppy India Pale Ale with citrus notes', 8.99, 10.99, 50, '/images/products/ipa-beer.jpg', 'Craft Brew Co.', '6.5%', '500ml', 'USA', '["craft", "ipa", "hoppy"]', 4.5, 23, TRUE, TRUE, TRUE, 1),
('Stout Porter', 'Dark beer with coffee and chocolate notes', 9.99, 11.99, 35, '/images/products/stout.jpg', 'Dark Brewery', '7.2%', '500ml', 'Ireland', '["stout", "dark", "coffee"]', 4.6, 31, TRUE, FALSE, TRUE, 1),
('Wheat Beer', 'Light and refreshing wheat beer', 7.99, 9.99, 40, '/images/products/wheat-beer.jpg', 'Sunshine Brews', '5.0%', '500ml', 'Germany', '["wheat", "light", "refreshing"]', 4.3, 18, TRUE, FALSE, TRUE, 1),
('Lager Classic', 'Crisp and clean traditional lager', 6.99, 8.99, 60, '/images/products/lager.jpg', 'Classic Brews', '4.8%', '500ml', 'Czech Republic', '["lager", "crisp", "traditional"]', 4.1, 25, TRUE, FALSE, TRUE, 1),

-- Wine Products
('Cabernet Sauvignon', 'Full-bodied red wine with dark fruit flavors', 24.99, 29.99, 30, '/images/products/cabernet.jpg', 'Vineyard Estate', '13.5%', '750ml', 'California', '["red wine", "full-bodied", "dark fruit"]', 4.7, 45, TRUE, TRUE, TRUE, 2),
('Chardonnay White', 'Buttery white wine with oak notes', 19.99, 24.99, 25, '/images/products/chardonnay.jpg', 'White Vineyards', '13.0%', '750ml', 'France', '["white wine", "buttery", "oak"]', 4.4, 38, TRUE, FALSE, TRUE, 2),
('Pinot Noir', 'Light red wine with cherry and spice', 22.99, 27.99, 20, '/images/products/pinot-noir.jpg', 'Burgundy Wines', '12.5%', '750ml', 'France', '["pinot noir", "light", "cherry"]', 4.5, 42, TRUE, FALSE, TRUE, 2),
('Prosecco Sparkling', 'Italian sparkling wine with crisp bubbles', 16.99, 19.99, 35, '/images/products/prosecco.jpg', 'Veneto Wines', '11.5%', '750ml', 'Italy', '["sparkling", "prosecco", "crisp"]', 4.3, 29, TRUE, FALSE, TRUE, 2),

-- Whiskey Products
('Single Malt Scotch', 'Aged 12 years with smoky and peaty notes', 89.99, 109.99, 15, '/images/products/scotch.jpg', 'Highland Distillery', '40%', '700ml', 'Scotland', '["scotch", "single malt", "smoky"]', 4.8, 67, TRUE, TRUE, TRUE, 3),
('Bourbon Whiskey', 'American bourbon with vanilla and caramel', 45.99, 54.99, 22, '/images/products/bourbon.jpg', 'Kentucky Distillers', '45%', '750ml', 'USA', '["bourbon", "vanilla", "caramel"]', 4.6, 51, TRUE, FALSE, TRUE, 3),
('Irish Whiskey', 'Smooth Irish whiskey with honey notes', 39.99, 47.99, 18, '/images/products/irish-whiskey.jpg', 'Emerald Isle', '40%', '700ml', 'Ireland', '["irish", "smooth", "honey"]', 4.4, 33, TRUE, FALSE, TRUE, 3),
('Rye Whiskey', 'Spicy rye whiskey with bold character', 52.99, 62.99, 12, '/images/products/rye-whiskey.jpg', 'Rye Masters', '46%', '750ml', 'Canada', '["rye", "spicy", "bold"]', 4.7, 28, TRUE, FALSE, TRUE, 3),

-- Vodka Products
('Premium Vodka', 'Triple distilled vodka with smooth finish', 34.99, 39.99, 25, '/images/products/vodka.jpg', 'Crystal Clear', '40%', '750ml', 'Poland', '["vodka", "premium", "smooth"]', 4.3, 34, TRUE, FALSE, TRUE, 4),
('Flavored Vodka', 'Citrus-infused vodka with zesty notes', 28.99, 32.99, 30, '/images/products/citrus-vodka.jpg', 'Zest Spirits', '40%', '750ml', 'Russia', '["vodka", "citrus", "flavored"]', 4.2, 22, TRUE, FALSE, TRUE, 4),
('Grey Goose', 'Premium French vodka with exceptional smoothness', 49.99, 59.99, 15, '/images/products/grey-goose.jpg', 'Grey Goose', '40%', '750ml', 'France', '["vodka", "premium", "french"]', 4.8, 89, TRUE, TRUE, TRUE, 4),

-- Rum Products
('Dark Rum', 'Aged rum with caramel and vanilla notes', 29.99, 34.99, 20, '/images/products/rum.jpg', 'Caribbean Gold', '40%', '700ml', 'Jamaica', '["rum", "dark", "aged"]', 4.4, 28, TRUE, FALSE, TRUE, 5),
('White Rum', 'Clean and crisp white rum', 19.99, 24.99, 35, '/images/products/white-rum.jpg', 'Tropical Spirits', '40%', '700ml', 'Puerto Rico', '["rum", "white", "crisp"]', 4.1, 19, TRUE, FALSE, TRUE, 5),
('Spiced Rum', 'Aromatic spiced rum with warm spices', 24.99, 29.99, 25, '/images/products/spiced-rum.jpg', 'Spice Island', '40%', '700ml', 'Barbados', '["rum", "spiced", "aromatic"]', 4.3, 26, TRUE, FALSE, TRUE, 5),

-- Gin Products
('London Dry Gin', 'Classic gin with juniper and botanical notes', 32.99, 37.99, 18, '/images/products/gin.jpg', 'Botanical Co.', '40%', '700ml', 'England', '["gin", "london dry", "botanical"]', 4.6, 41, TRUE, FALSE, TRUE, 6),
('Hendrick\'s Gin', 'Cucumber and rose petal infused gin', 44.99, 49.99, 12, '/images/products/hendricks.jpg', 'Hendrick\'s', '41.4%', '700ml', 'Scotland', '["gin", "cucumber", "rose"]', 4.7, 73, TRUE, TRUE, TRUE, 6),
('Navy Strength Gin', 'High-proof gin with intense botanicals', 38.99, 44.99, 8, '/images/products/navy-gin.jpg', 'Navy Spirits', '57%', '700ml', 'England', '["gin", "navy strength", "high-proof"]', 4.5, 35, TRUE, FALSE, TRUE, 6),

-- Tequila Products
('Añejo Tequila', 'Aged tequila with oak and vanilla flavors', 79.99, 89.99, 12, '/images/products/tequila.jpg', 'Agave Masters', '40%', '700ml', 'Mexico', '["tequila", "añejo", "aged"]', 4.7, 52, TRUE, TRUE, TRUE, 7),
('Blanco Tequila', 'Pure silver tequila with agave notes', 34.99, 39.99, 20, '/images/products/blanco-tequila.jpg', 'Agave Pure', '40%', '700ml', 'Mexico', '["tequila", "blanco", "pure"]', 4.4, 31, TRUE, FALSE, TRUE, 7),
('Reposado Tequila', 'Rested tequila with smooth character', 49.99, 59.99, 15, '/images/products/reposado-tequila.jpg', 'Resting Spirits', '40%', '700ml', 'Mexico', '["tequila", "reposado", "rested"]', 4.6, 44, TRUE, FALSE, TRUE, 7),

-- Liqueur Products
('Coffee Liqueur', 'Rich coffee liqueur with chocolate notes', 22.99, 26.99, 35, '/images/products/coffee-liqueur.jpg', 'Mocha Delight', '20%', '500ml', 'Italy', '["liqueur", "coffee", "chocolate"]', 4.2, 19, TRUE, FALSE, TRUE, 8),
('Baileys Irish Cream', 'Creamy Irish cream liqueur', 24.99, 28.99, 40, '/images/products/baileys.jpg', 'Baileys', '17%', '750ml', 'Ireland', '["liqueur", "irish cream", "creamy"]', 4.5, 156, TRUE, TRUE, TRUE, 8),
('Grand Marnier', 'Orange cognac liqueur with citrus notes', 39.99, 44.99, 18, '/images/products/grand-marnier.jpg', 'Grand Marnier', '40%', '700ml', 'France', '["liqueur", "orange", "cognac"]', 4.6, 67, TRUE, FALSE, TRUE, 8),
('Amaretto', 'Sweet almond liqueur with marzipan notes', 19.99, 23.99, 30, '/images/products/amaretto.jpg', 'Almond Delight', '28%', '700ml', 'Italy', '["liqueur", "almond", "sweet"]', 4.3, 42, TRUE, FALSE, TRUE, 8);

-- Insert sample users
INSERT INTO users (email, firstName, lastName, phone, dateOfBirth, isActive, isEmailVerified) VALUES
('john.doe@example.com', 'John', 'Doe', '+1234567890', '1990-05-15', TRUE, TRUE),
('jane.smith@example.com', 'Jane', 'Smith', '+1234567891', '1985-08-22', TRUE, TRUE),
('mike.wilson@example.com', 'Mike', 'Wilson', '+1234567892', '1988-12-03', TRUE, TRUE),
('sarah.johnson@example.com', 'Sarah', 'Johnson', '+1234567893', '1992-07-18', TRUE, TRUE),
('david.brown@example.com', 'David', 'Brown', '+1234567894', '1987-03-25', TRUE, TRUE),
('lisa.garcia@example.com', 'Lisa', 'Garcia', '+1234567895', '1995-09-12', TRUE, TRUE),
('robert.miller@example.com', 'Robert', 'Miller', '+1234567896', '1983-11-08', TRUE, TRUE),
('emily.davis@example.com', 'Emily', 'Davis', '+1234567897', '1991-04-30', TRUE, TRUE);

-- Insert sample carts for users
INSERT INTO carts (userId, totalAmount, totalItems) VALUES
(1, 0, 0),
(2, 0, 0),
(3, 0, 0),
(4, 0, 0),
(5, 0, 0);

-- Insert sample cart items
INSERT INTO cart_items (cartId, productId, quantity, price) VALUES
-- User 1's cart (John Doe)
(1, 1, 2, 8.99),   -- Craft IPA Beer
(1, 2, 1, 24.99),  -- Cabernet Sauvignon
(1, 15, 1, 49.99), -- Grey Goose

-- User 2's cart (Jane Smith)
(2, 3, 3, 7.99),   -- Wheat Beer
(2, 6, 1, 89.99),  -- Single Malt Scotch
(2, 20, 2, 19.99), -- Baileys Irish Cream

-- User 3's cart (Mike Wilson)
(3, 4, 4, 6.99),   -- Lager Classic
(3, 8, 1, 45.99),  -- Bourbon Whiskey
(3, 12, 2, 28.99), -- Flavored Vodka

-- User 4's cart (Sarah Johnson)
(4, 5, 1, 19.99),  -- Chardonnay White
(4, 9, 1, 39.99),  -- Irish Whiskey
(4, 13, 1, 32.99), -- London Dry Gin

-- User 5's cart (David Brown)
(5, 7, 2, 34.99),  -- Premium Vodka
(5, 11, 1, 24.99), -- Spiced Rum
(5, 16, 1, 39.99); -- Grand Marnier

-- Update cart totals
UPDATE carts SET 
    totalAmount = (SELECT SUM(quantity * price) FROM cart_items WHERE cartId = 1),
    totalItems = (SELECT SUM(quantity) FROM cart_items WHERE cartId = 1)
WHERE id = 1;

UPDATE carts SET 
    totalAmount = (SELECT SUM(quantity * price) FROM cart_items WHERE cartId = 2),
    totalItems = (SELECT SUM(quantity) FROM cart_items WHERE cartId = 2)
WHERE id = 2;

UPDATE carts SET 
    totalAmount = (SELECT SUM(quantity * price) FROM cart_items WHERE cartId = 3),
    totalItems = (SELECT SUM(quantity) FROM cart_items WHERE cartId = 3)
WHERE id = 3;

UPDATE carts SET 
    totalAmount = (SELECT SUM(quantity * price) FROM cart_items WHERE cartId = 4),
    totalItems = (SELECT SUM(quantity) FROM cart_items WHERE cartId = 4)
WHERE id = 4;

UPDATE carts SET 
    totalAmount = (SELECT SUM(quantity * price) FROM cart_items WHERE cartId = 5),
    totalItems = (SELECT SUM(quantity) FROM cart_items WHERE cartId = 5)
WHERE id = 5;

-- Insert sample orders
INSERT INTO orders (orderNumber, userId, subtotal, tax, shipping, total, status, paymentStatus, shippingAddress, billingAddress, notes) VALUES
('ORD-001', 1, 42.97, 3.44, 5.99, 52.40, 'delivered', 'paid', '123 Main St, New York, NY 10001', '123 Main St, New York, NY 10001', 'Delivered successfully'),
('ORD-002', 2, 127.97, 10.24, 5.99, 144.20, 'delivered', 'paid', '456 Oak Ave, Los Angeles, CA 90210', '456 Oak Ave, Los Angeles, CA 90210', 'Gift wrapping requested'),
('ORD-003', 3, 89.95, 7.20, 5.99, 103.14, 'shipped', 'paid', '789 Pine St, Chicago, IL 60601', '789 Pine St, Chicago, IL 60601', 'Express shipping'),
('ORD-004', 4, 92.97, 7.44, 5.99, 106.40, 'processing', 'paid', '321 Elm St, Houston, TX 77001', '321 Elm St, Houston, TX 77001', ''),
('ORD-005', 5, 99.97, 8.00, 5.99, 113.96, 'pending', 'pending', '654 Maple Dr, Phoenix, AZ 85001', '654 Maple Dr, Phoenix, AZ 85001', 'Customer requested call before delivery');

-- Insert sample order items
INSERT INTO order_items (orderId, productId, quantity, price) VALUES
-- Order 1 (John Doe - completed)
(1, 1, 2, 8.99),   -- Craft IPA Beer
(1, 2, 1, 24.99),  -- Cabernet Sauvignon

-- Order 2 (Jane Smith - completed)
(2, 3, 3, 7.99),   -- Wheat Beer
(2, 6, 1, 89.99),  -- Single Malt Scotch
(2, 20, 2, 19.99), -- Baileys Irish Cream

-- Order 3 (Mike Wilson - shipped)
(3, 4, 4, 6.99),   -- Lager Classic
(3, 8, 1, 45.99),  -- Bourbon Whiskey
(3, 12, 2, 28.99), -- Flavored Vodka

-- Order 4 (Sarah Johnson - processing)
(4, 5, 1, 19.99),  -- Chardonnay White
(4, 9, 1, 39.99),  -- Irish Whiskey
(4, 13, 1, 32.99), -- London Dry Gin

-- Order 5 (David Brown - pending)
(5, 7, 2, 34.99),  -- Premium Vodka
(5, 11, 1, 24.99), -- Spiced Rum
(5, 16, 1, 39.99); -- Grand Marnier
