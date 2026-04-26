"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModel = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let VehicleModel = class VehicleModel {
    id;
    name;
    products;
    createdAt;
    updatedAt;
};
exports.VehicleModel = VehicleModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], VehicleModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_entity_1.Product, (product) => product.vehicleModels),
    __metadata("design:type", Array)
], VehicleModel.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], VehicleModel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], VehicleModel.prototype, "updatedAt", void 0);
exports.VehicleModel = VehicleModel = __decorate([
    (0, typeorm_1.Entity)('vehicle_models')
], VehicleModel);
//# sourceMappingURL=vehicle-model.entity.js.map