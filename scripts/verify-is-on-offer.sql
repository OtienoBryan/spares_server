-- Verify isOnOffer column exists and check current values
-- Run this to verify the column exists and see which products are on offer

-- Check if column exists
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'products'
  AND COLUMN_NAME = 'isOnOffer';

-- Show all products with their isOnOffer status
SELECT id, name, isOnOffer, isFeatured, isActive
FROM products
ORDER BY id DESC
LIMIT 20;

-- Count products on offer
SELECT 
  COUNT(*) as total_products,
  SUM(CASE WHEN isOnOffer = 1 THEN 1 ELSE 0 END) as products_on_offer,
  SUM(CASE WHEN isOnOffer = 0 THEN 1 ELSE 0 END) as products_not_on_offer
FROM products;
