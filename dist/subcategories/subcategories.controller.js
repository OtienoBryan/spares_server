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
exports.SubCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const subcategories_service_1 = require("./subcategories.service");
let SubCategoriesController = class SubCategoriesController {
    subCategoriesService;
    constructor(subCategoriesService) {
        this.subCategoriesService = subCategoriesService;
    }
    async findAll(categoryId) {
        if (categoryId) {
            const categoryIdNum = parseInt(categoryId, 10);
            if (isNaN(categoryIdNum)) {
                throw new common_1.HttpException('Invalid category ID', common_1.HttpStatus.BAD_REQUEST);
            }
            return this.subCategoriesService.findByCategory(categoryIdNum);
        }
        return this.subCategoriesService.findAll();
    }
    async findOne(id) {
        const subCategory = await this.subCategoriesService.findOne(id);
        if (!subCategory) {
            throw new common_1.HttpException('SubCategory not found', common_1.HttpStatus.NOT_FOUND);
        }
        return subCategory;
    }
    async create(createSubCategoryDto) {
        try {
            return await this.subCategoriesService.create(createSubCategoryDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to create subcategory', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateSubCategoryDto) {
        try {
            const subCategory = await this.subCategoriesService.update(id, updateSubCategoryDto);
            if (!subCategory) {
                throw new common_1.HttpException('SubCategory not found', common_1.HttpStatus.NOT_FOUND);
            }
            return subCategory;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update subcategory', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async toggleActive(id) {
        const subCategory = await this.subCategoriesService.toggleActive(id);
        if (!subCategory) {
            throw new common_1.HttpException('SubCategory not found', common_1.HttpStatus.NOT_FOUND);
        }
        return subCategory;
    }
    async remove(id) {
        const success = await this.subCategoriesService.remove(id);
        if (!success) {
            throw new common_1.HttpException('SubCategory not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'SubCategory deleted successfully' };
    }
};
exports.SubCategoriesController = SubCategoriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubCategoriesController.prototype, "remove", null);
exports.SubCategoriesController = SubCategoriesController = __decorate([
    (0, common_1.Controller)('api/subcategories'),
    __metadata("design:paramtypes", [subcategories_service_1.SubCategoriesService])
], SubCategoriesController);
//# sourceMappingURL=subcategories.controller.js.map