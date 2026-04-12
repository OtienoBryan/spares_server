import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryRepository.find({
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findByCategory(categoryId: number): Promise<SubCategory[]> {
    return this.subCategoryRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<SubCategory | null> {
    return this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async create(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    // Verify that the parent category exists
    const category = await this.categoryRepository.findOne({
      where: { id: createSubCategoryDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Parent category not found');
    }

    const subCategory = this.subCategoryRepository.create({
      ...createSubCategoryDto,
      isActive: createSubCategoryDto.isActive !== undefined ? createSubCategoryDto.isActive : true,
    });

    return this.subCategoryRepository.save(subCategory);
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<SubCategory | null> {
    const subCategory = await this.findOne(id);
    if (!subCategory) {
      return null;
    }

    // If changing category, verify the new category exists
    if (updateSubCategoryDto.categoryId && updateSubCategoryDto.categoryId !== subCategory.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateSubCategoryDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Parent category not found');
      }
    }

    Object.assign(subCategory, updateSubCategoryDto);
    return this.subCategoryRepository.save(subCategory);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.subCategoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async toggleActive(id: number): Promise<SubCategory | null> {
    const subCategory = await this.findOne(id);
    if (!subCategory) {
      return null;
    }

    subCategory.isActive = !subCategory.isActive;
    return this.subCategoryRepository.save(subCategory);
  }
}
