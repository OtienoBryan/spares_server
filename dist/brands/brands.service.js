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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const brand_entity_1 = require("../entities/brand.entity");
let BrandsService = class BrandsService {
    productRepository;
    categoryRepository;
    brandRepository;
    constructor(productRepository, categoryRepository, brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }
    async getAllBrands() {
        const products = await this.productRepository.find({
            relations: ['category'],
            select: ['brand', 'category'],
        });
        const brandMap = new Map();
        products.forEach(product => {
            if (product.brand && product.category) {
                const brandKey = product.brand.toLowerCase();
                if (!brandMap.has(brandKey)) {
                    brandMap.set(brandKey, new Map());
                }
                const categoryMap = brandMap.get(brandKey);
                const currentCount = categoryMap.get(product.category.id) || 0;
                categoryMap.set(product.category.id, currentCount + 1);
            }
        });
        const brands = [];
        for (const [brandName, categoryMap] of brandMap) {
            for (const [categoryId, productCount] of categoryMap) {
                const category = await this.categoryRepository.findOne({
                    where: { id: categoryId },
                });
                if (category) {
                    brands.push({
                        name: brandName,
                        category: category,
                        productCount: productCount,
                    });
                }
            }
        }
        return brands.sort((a, b) => {
            if (a.name !== b.name) {
                return a.name.localeCompare(b.name);
            }
            return a.category.name.localeCompare(b.category.name);
        });
    }
    async getBrandsByCategory(categoryId) {
        const products = await this.productRepository.find({
            where: { categoryId },
            relations: ['category'],
            select: ['brand', 'category'],
        });
        const brandMap = new Map();
        products.forEach(product => {
            if (product.brand) {
                const brandKey = product.brand.toLowerCase();
                const currentCount = brandMap.get(brandKey) || 0;
                brandMap.set(brandKey, currentCount + 1);
            }
        });
        const brands = [];
        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
        });
        if (category) {
            for (const [brandName, productCount] of brandMap) {
                brands.push({
                    name: brandName,
                    category: category,
                    productCount: productCount,
                });
            }
        }
        return brands.sort((a, b) => a.name.localeCompare(b.name));
    }
    async getBrandsWithProductCount() {
        return this.getAllBrands();
    }
    async getAllBrandsForAdmin() {
        return this.brandRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async getBrandById(id) {
        return this.brandRepository.findOne({ where: { id } });
    }
    async createBrand(brandData) {
        const brand = this.brandRepository.create(brandData);
        return this.brandRepository.save(brand);
    }
    async updateBrand(id, brandData) {
        console.log('🏷️ [BrandsService] updateBrand called with:');
        console.log('  ID:', id);
        console.log('  Brand Data:', JSON.stringify(brandData, null, 2));
        try {
            const updateResult = await this.brandRepository.update(id, brandData);
            console.log('  Update result:', updateResult);
            const updatedBrand = await this.getBrandById(id);
            console.log('✅ [BrandsService] Brand updated successfully:', updatedBrand);
            if (!updatedBrand) {
                throw new Error(`Brand with ID ${id} not found after update`);
            }
            return updatedBrand;
        }
        catch (error) {
            console.error('❌ [BrandsService] Error updating brand:', error);
            throw error;
        }
    }
    async deleteBrand(id) {
        const productsWithBrand = await this.productRepository.count({
            where: { brandId: id },
        });
        if (productsWithBrand > 0) {
            throw new Error(`Cannot delete brand. ${productsWithBrand} products are using this brand.`);
        }
        const result = await this.brandRepository.delete(id);
        return { success: (result.affected ?? 0) > 0 };
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BrandsService);
//# sourceMappingURL=brands.service.js.map