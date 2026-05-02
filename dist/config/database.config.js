"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const entities_1 = require("../entities");
const staff_entity_1 = require("../entities/staff.entity");
const getDatabaseConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [entities_1.Category, entities_1.Product, entities_1.User, entities_1.Cart, entities_1.CartItem, entities_1.Order, entities_1.OrderItem, entities_1.Rider, entities_1.SubCategory, entities_1.Brand, staff_entity_1.Staff, entities_1.Blog, entities_1.VehicleModel, entities_1.VehicleMake, entities_1.VehicleYear, entities_1.ProductImage],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map