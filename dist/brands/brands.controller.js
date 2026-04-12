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
exports.BrandsController = void 0;
const common_1 = require("@nestjs/common");
const brands_service_1 = require("./brands.service");
let BrandsController = class BrandsController {
    brandsService;
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async getAllBrands(categoryId) {
        if (!categoryId) {
            return this.brandsService.getAllBrandsForAdmin();
        }
        const categoryIdNum = parseInt(categoryId, 10);
        if (isNaN(categoryIdNum)) {
            throw new Error('Invalid category ID');
        }
        return this.brandsService.getBrandsByCategory(categoryIdNum);
    }
    async getBrandById(id) {
        return this.brandsService.getBrandById(id);
    }
    async createBrand(brandData) {
        return this.brandsService.createBrand(brandData);
    }
    async updateBrand(id, brandData) {
        console.log('🏷️ [BrandsController] PUT /api/admin/brands/:id called');
        console.log('  ID:', id);
        console.log('  Request Body:', JSON.stringify(brandData, null, 2));
        try {
            const result = await this.brandsService.updateBrand(id, brandData);
            console.log('✅ [BrandsController] Brand updated successfully:', result);
            return result;
        }
        catch (error) {
            console.error('❌ [BrandsController] Error updating brand:', error);
            throw error;
        }
    }
    async deleteBrand(id) {
        return this.brandsService.deleteBrand(id);
    }
};
exports.BrandsController = BrandsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getAllBrands", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getBrandById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "deleteBrand", null);
exports.BrandsController = BrandsController = __decorate([
    (0, common_1.Controller)('api/admin/brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map