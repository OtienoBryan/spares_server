import { SubCategoriesService } from './subcategories.service';
import type { CreateSubCategoryDto, UpdateSubCategoryDto } from './subcategories.service';
export declare class SubCategoriesController {
    private readonly subCategoriesService;
    constructor(subCategoriesService: SubCategoriesService);
    findAll(categoryId?: string): Promise<import("../entities").SubCategory[]>;
    findOne(id: number): Promise<import("../entities").SubCategory>;
    create(createSubCategoryDto: CreateSubCategoryDto): Promise<import("../entities").SubCategory>;
    update(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<import("../entities").SubCategory>;
    toggleActive(id: number): Promise<import("../entities").SubCategory>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
