import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
export interface BrandInfo {
    name: string;
    category: Category;
    productCount: number;
}
export interface CreateBrandDto {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    country?: string;
    foundedYear?: number;
    categoryId?: number;
    isActive?: boolean;
}
export interface UpdateBrandDto {
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
    country?: string;
    foundedYear?: number;
    categoryId?: number;
    isActive?: boolean;
}
export declare class BrandsService {
    private productRepository;
    private categoryRepository;
    private brandRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, brandRepository: Repository<Brand>);
    getAllBrands(): Promise<BrandInfo[]>;
    getBrandsByCategory(categoryId: number): Promise<BrandInfo[]>;
    getBrandsWithProductCount(): Promise<BrandInfo[]>;
    getAllBrandsForAdmin(): Promise<Brand[]>;
    getBrandById(id: number): Promise<Brand | null>;
    createBrand(brandData: CreateBrandDto): Promise<Brand>;
    updateBrand(id: number, brandData: UpdateBrandDto): Promise<Brand>;
    deleteBrand(id: number): Promise<{
        success: boolean;
    }>;
}
