import { BrandsService, BrandInfo } from './brands.service';
import type { CreateBrandDto, UpdateBrandDto } from './brands.service';
import { Brand } from '../entities/brand.entity';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    getAllBrands(categoryId?: string): Promise<BrandInfo[] | Brand[]>;
    getBrandById(id: number): Promise<Brand | null>;
    createBrand(brandData: CreateBrandDto): Promise<Brand>;
    updateBrand(id: number, brandData: UpdateBrandDto): Promise<Brand>;
    deleteBrand(id: number): Promise<{
        success: boolean;
    }>;
}
