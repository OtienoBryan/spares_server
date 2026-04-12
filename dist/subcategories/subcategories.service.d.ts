import { Repository } from 'typeorm';
import { SubCategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
export interface CreateSubCategoryDto {
    name: string;
    description?: string;
    isActive?: boolean;
    categoryId: number;
}
export interface UpdateSubCategoryDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    categoryId?: number;
}
export declare class SubCategoriesService {
    private readonly subCategoryRepository;
    private readonly categoryRepository;
    constructor(subCategoryRepository: Repository<SubCategory>, categoryRepository: Repository<Category>);
    findAll(): Promise<SubCategory[]>;
    findByCategory(categoryId: number): Promise<SubCategory[]>;
    findOne(id: number): Promise<SubCategory | null>;
    create(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory>;
    update(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<SubCategory | null>;
    remove(id: number): Promise<boolean>;
    toggleActive(id: number): Promise<SubCategory | null>;
}
