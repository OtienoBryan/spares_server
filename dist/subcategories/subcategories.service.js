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
exports.SubCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcategory_entity_1 = require("../entities/subcategory.entity");
const category_entity_1 = require("../entities/category.entity");
let SubCategoriesService = class SubCategoriesService {
    subCategoryRepository;
    categoryRepository;
    constructor(subCategoryRepository, categoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        return this.subCategoryRepository.find({
            relations: ['category'],
            order: { name: 'ASC' },
        });
    }
    async findByCategory(categoryId) {
        return this.subCategoryRepository.find({
            where: { categoryId, isActive: true },
            relations: ['category'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        return this.subCategoryRepository.findOne({
            where: { id },
            relations: ['category'],
        });
    }
    async create(createSubCategoryDto) {
        const category = await this.categoryRepository.findOne({
            where: { id: createSubCategoryDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Parent category not found');
        }
        const subCategory = this.subCategoryRepository.create({
            ...createSubCategoryDto,
            isActive: createSubCategoryDto.isActive !== undefined ? createSubCategoryDto.isActive : true,
        });
        return this.subCategoryRepository.save(subCategory);
    }
    async update(id, updateSubCategoryDto) {
        const subCategory = await this.findOne(id);
        if (!subCategory) {
            return null;
        }
        if (updateSubCategoryDto.categoryId && updateSubCategoryDto.categoryId !== subCategory.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateSubCategoryDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        Object.assign(subCategory, updateSubCategoryDto);
        return this.subCategoryRepository.save(subCategory);
    }
    async remove(id) {
        const result = await this.subCategoryRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async toggleActive(id) {
        const subCategory = await this.findOne(id);
        if (!subCategory) {
            return null;
        }
        subCategory.isActive = !subCategory.isActive;
        return this.subCategoryRepository.save(subCategory);
    }
};
exports.SubCategoriesService = SubCategoriesService;
exports.SubCategoriesService = SubCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubCategoriesService);
//# sourceMappingURL=subcategories.service.js.map