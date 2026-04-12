-- Add skus column to products table
-- This column stores JSON array of SKU objects with different prices

ALTER TABLE products 
ADD COLUMN skus JSON NULL;

-- Verify the column was added
DESCRIBE products;
