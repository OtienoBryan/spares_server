-- Run in your MySQL schema (e.g. impulsep_spares in phpMyAdmin: select DB, then SQL tab).
-- Fixes: ER_NO_SUCH_TABLE product_vehicle_models
-- Safe: CREATE IF NOT EXISTS; INSERT IGNORE skips duplicates.

CREATE TABLE IF NOT EXISTS product_vehicle_models (
  productId INT NOT NULL,
  vehicleModelId INT NOT NULL,
  PRIMARY KEY (productId, vehicleModelId),
  CONSTRAINT fk_pvm_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pvm_vehicle_model FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO product_vehicle_models (productId, vehicleModelId)
SELECT id, vehicleModelId FROM products WHERE vehicleModelId IS NOT NULL;
