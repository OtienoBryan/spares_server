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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    constructor(productRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        return this.productRepository.find({
            relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.productRepository.findOne({
            where: { id, isActive: true },
            relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
        });
    }
    async findByCategory(categoryId) {
        return this.productRepository.find({
            where: { categoryId, isActive: true },
            relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
            order: { createdAt: 'DESC' },
        });
    }
    async findFeatured() {
        return this.productRepository.find({
            where: { isFeatured: true, isActive: true },
            relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
            order: { createdAt: 'DESC' },
        });
    }
    async findPopularWines() {
        return this.productRepository.find({
            where: { isPopularWine: true, isActive: true },
            relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
            order: { createdAt: 'DESC' },
        });
    }
    async search(query) {
        return this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subcategory', 'subcategory')
            .leftJoinAndSelect('product.vehicleModel', 'vehicleModel')
            .leftJoinAndSelect('product.vehicleModels', 'vehicleModels')
            .where('product.isActive = :isActive', { isActive: true })
            .andWhere('(product.name LIKE :query OR product.description LIKE :query OR product.brand LIKE :query)', { query: `%${query}%` })
            .orderBy('product.createdAt', 'DESC')
            .getMany();
    }
    async getCategories() {
        return this.categoryRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async getCategoryById(id) {
        return this.categoryRepository.findOne({
            where: { id, isActive: true },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map