-- Many-to-many: products <-> vehicle_models (admin can assign multiple models per product).
-- Run once against your app database. Safe to re-run if table exists (skipped manually).

SET @db := DATABASE();

SET @tbl := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'product_vehicle_models'
);

SET @sql := IF(@tbl = 0,
  'CREATE TABLE product_vehicle_models (
    productId INT NOT NULL,
    vehicleModelId INT NOT NULL,
    PRIMARY KEY (productId, vehicleModelId),
    CONSTRAINT fk_pvm_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_pvm_vehicle_model FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id) ON DELETE CASCADE
  )',
  'SELECT ''product_vehicle_models already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Backfill from legacy single FK
INSERT IGNORE INTO product_vehicle_models (productId, vehicleModelId)
SELECT id, vehicleModelId FROM products WHERE vehicleModelId IS NOT NULL;
