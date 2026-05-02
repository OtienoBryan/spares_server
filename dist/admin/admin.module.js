"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const brand_entity_1 = require("../entities/brand.entity");
const subcategory_entity_1 = require("../entities/subcategory.entity");
const staff_entity_1 = require("../entities/staff.entity");
const blog_entity_1 = require("../entities/blog.entity");
const vehicle_model_entity_1 = require("../entities/vehicle-model.entity");
const vehicle_make_entity_1 = require("../entities/vehicle-make.entity");
const vehicle_year_entity_1 = require("../entities/vehicle-year.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, category_entity_1.Category, order_entity_1.Order, user_entity_1.User, brand_entity_1.Brand, subcategory_entity_1.SubCategory, staff_entity_1.Staff, blog_entity_1.Blog, vehicle_model_entity_1.VehicleModel, vehicle_make_entity_1.VehicleMake, vehicle_year_entity_1.VehicleYear]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map