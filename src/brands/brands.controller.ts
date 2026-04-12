import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { BrandsService, BrandInfo } from './brands.service';
import type { CreateBrandDto, UpdateBrandDto } from './brands.service';
import { Brand } from '../entities/brand.entity';

@Controller('api/admin/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getAllBrands(@Query('categoryId') categoryId?: string): Promise<BrandInfo[] | Brand[]> {
    // If no categoryId is provided, return brands for admin interface
    if (!categoryId) {
      return this.brandsService.getAllBrandsForAdmin();
    }
    
    const categoryIdNum = parseInt(categoryId, 10);
    if (isNaN(categoryIdNum)) {
      throw new Error('Invalid category ID');
    }
    return this.brandsService.getBrandsByCategory(categoryIdNum);
  }

  @Get(':id')
  async getBrandById(@Param('id', ParseIntPipe) id: number): Promise<Brand | null> {
    return this.brandsService.getBrandById(id);
  }

  @Post()
  async createBrand(@Body() brandData: CreateBrandDto): Promise<Brand> {
    return this.brandsService.createBrand(brandData);
  }

  @Put(':id')
  async updateBrand(@Param('id', ParseIntPipe) id: number, @Body() brandData: UpdateBrandDto): Promise<Brand> {
    console.log('🏷️ [BrandsController] PUT /api/admin/brands/:id called');
    console.log('  ID:', id);
    console.log('  Request Body:', JSON.stringify(brandData, null, 2));
    
    try {
      const result = await this.brandsService.updateBrand(id, brandData);
      console.log('✅ [BrandsController] Brand updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ [BrandsController] Error updating brand:', error);
      throw error;
    }
  }

  @Delete(':id')
  async deleteBrand(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    return this.brandsService.deleteBrand(id);
  }
}
