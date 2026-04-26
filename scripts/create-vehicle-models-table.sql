-- Create vehicle_models table (admin-managed list of vehicle models)
CREATE TABLE IF NOT EXISTS vehicle_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_models_name ON vehicle_models(name);

