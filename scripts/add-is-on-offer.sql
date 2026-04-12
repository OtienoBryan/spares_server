-- Add isOnOffer column to products table
ALTER TABLE `products`
  ADD COLUMN `isOnOffer` TINYINT(1) NOT NULL DEFAULT 0
  AFTER `isFeatured`;
