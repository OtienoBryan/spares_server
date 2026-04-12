import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  HttpStatus,
  HttpException,
  Query
} from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import type { CreateSubCategoryDto, UpdateSubCategoryDto } from './subcategories.service';

@Controller('api/subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Get()
  async findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      const categoryIdNum = parseInt(categoryId, 10);
      if (isNaN(categoryIdNum)) {
        throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
      }
      return this.subCategoriesService.findByCategory(categoryIdNum);
    }
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const subCategory = await this.subCategoriesService.findOne(id);
    if (!subCategory) {
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    }
    return subCategory;
  }

  @Post()
  async create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    try {
      return await this.subCategoriesService.create(createSubCategoryDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create subcategory', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto
  ) {
    try {
      const subCategory = await this.subCategoriesService.update(id, updateSubCategoryDto);
      if (!subCategory) {
        throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
      }
      return subCategory;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update subcategory', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    const subCategory = await this.subCategoriesService.toggleActive(id);
    if (!subCategory) {
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    }
    return subCategory;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const success = await this.subCategoriesService.remove(id);
    if (!success) {
      throw new HttpException('SubCategory not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'SubCategory deleted successfully' };
  }
}
