import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getAllBrands(): Promise<BrandInfo[]> {
    // Get all products with their categories
    const products = await this.productRepository.find({
      relations: ['category'],
      select: ['brand', 'category'],
    });

    // Group products by brand and category
    const brandMap = new Map<string, Map<number, number>>();

    products.forEach(product => {
      if (product.brand && product.category) {
        const brandKey = product.brand.toLowerCase();
        if (!brandMap.has(brandKey)) {
          brandMap.set(brandKey, new Map());
        }
        
        const categoryMap = brandMap.get(brandKey)!;
        const currentCount = categoryMap.get(product.category.id) || 0;
        categoryMap.set(product.category.id, currentCount + 1);
      }
    });

    // Convert to BrandInfo array
    const brands: BrandInfo[] = [];
    
    for (const [brandName, categoryMap] of brandMap) {
      for (const [categoryId, productCount] of categoryMap) {
        // Get the category details
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

    // Sort by brand name, then by category name
    return brands.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name.localeCompare(b.name);
      }
      return a.category.name.localeCompare(b.category.name);
    });
  }

  async getBrandsByCategory(categoryId: number): Promise<BrandInfo[]> {
    const products = await this.productRepository.find({
      where: { categoryId },
      relations: ['category'],
      select: ['brand', 'category'],
    });

    const brandMap = new Map<string, number>();

    products.forEach(product => {
      if (product.brand) {
        const brandKey = product.brand.toLowerCase();
        const currentCount = brandMap.get(brandKey) || 0;
        brandMap.set(brandKey, currentCount + 1);
      }
    });

    const brands: BrandInfo[] = [];
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

  async getBrandsWithProductCount(): Promise<BrandInfo[]> {
    // For now, use the existing method that works with products
    return this.getAllBrands();
  }

  // Method to get all brands for admin interface (with IDs)
  async getAllBrandsForAdmin(): Promise<Brand[]> {
    return this.brandRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getBrandById(id: number): Promise<Brand | null> {
    return this.brandRepository.findOne({ where: { id } });
  }

  async createBrand(brandData: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(brandData);
    return this.brandRepository.save(brand);
  }

  async updateBrand(id: number, brandData: UpdateBrandDto): Promise<Brand> {
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
    } catch (error) {
      console.error('❌ [BrandsService] Error updating brand:', error);
      throw error;
    }
  }

  async deleteBrand(id: number): Promise<{ success: boolean }> {
    // Check if any products are using this brand
    const productsWithBrand = await this.productRepository.count({
      where: { brandId: id },
    });

    if (productsWithBrand > 0) {
      throw new Error(`Cannot delete brand. ${productsWithBrand} products are using this brand.`);
    }

    const result = await this.brandRepository.delete(id);
    return { success: (result.affected ?? 0) > 0 };
  }
}
