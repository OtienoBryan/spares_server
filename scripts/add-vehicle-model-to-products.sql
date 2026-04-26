-- Add vehicle model relationship to products
-- Safe to run multiple times (checks information_schema).

SET @db := DATABASE();

-- Add column if missing
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'products' AND COLUMN_NAME = 'vehicleModelId'
);

SET @sql := IF(@col_exists = 0,
  'ALTER TABLE products ADD COLUMN vehicleModelId INT NULL',
  'SELECT \"vehicleModelId already exists\"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index if missing
SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'products' AND INDEX_NAME = 'idx_products_vehicle_model'
);

SET @sql := IF(@idx_exists = 0,
  'CREATE INDEX idx_products_vehicle_model ON products(vehicleModelId)',
  'SELECT \"idx_products_vehicle_model already exists\"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add FK if missing
SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = @db
    AND TABLE_NAME = 'products'
    AND COLUMN_NAME = 'vehicleModelId'
    AND REFERENCED_TABLE_NAME = 'vehicle_models'
);

SET @sql := IF(@fk_exists = 0,
  'ALTER TABLE products ADD CONSTRAINT fk_products_vehicle_models FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id) ON DELETE SET NULL',
  'SELECT \"fk_products_vehicle_models already exists\"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

