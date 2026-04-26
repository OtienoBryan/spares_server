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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const cart_item_entity_1 = require("./cart-item.entity");
const order_item_entity_1 = require("./order-item.entity");
const vehicle_model_entity_1 = require("./vehicle-model.entity");
let Product = class Product {
    id;
    name;
    description;
    price;
    originalPrice;
    stock;
    image;
    images;
    brand;
    alcoholContent;
    volume;
    origin;
    tags;
    skus;
    rating;
    reviewCount;
    isActive;
    isFeatured;
    isOnOffer;
    isPopularWine;
    requiresAgeVerification;
    category;
    categoryId;
    subcategory;
    subcategoryId;
    brandEntity;
    brandId;
    vehicleModel;
    vehicleModelId;
    vehicleModels;
    cartItems;
    orderItems;
    createdAt;
    updatedAt;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "alcoholContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "volume", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "skus", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isOnOffer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isPopularWine", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "requiresAgeVerification", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Category', 'products'),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", Object)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('SubCategory', 'products', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subcategoryId' }),
    __metadata("design:type", Object)
], Product.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "subcategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Brand', 'products', { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'brandId' }),
    __metadata("design:type", Object)
], Product.prototype, "brandEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_model_entity_1.VehicleModel, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'vehicleModelId' }),
    __metadata("design:type", vehicle_model_entity_1.VehicleModel)
], Product.prototype, "vehicleModel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "vehicleModelId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => vehicle_model_entity_1.VehicleModel, (vm) => vm.products, { eager: false }),
    (0, typeorm_1.JoinTable)({
        name: 'product_vehicle_models',
        joinColumn: { name: 'productId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'vehicleModelId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Product.prototype, "vehicleModels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_item_entity_1.CartItem, cartItem => cartItem.product),
    __metadata("design:type", Array)
], Product.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, orderItem => orderItem.product),
    __metadata("design:type", Array)
], Product.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map