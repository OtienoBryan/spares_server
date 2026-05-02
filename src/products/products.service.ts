import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { VehicleMake } from '../entities/vehicle-make.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(VehicleMake)
    private vehicleMakeRepository: Repository<VehicleMake>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPopularWines(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isPopularWine: true, isActive: true },
      relations: ['category', 'subcategory', 'vehicleModel', 'vehicleModels'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .leftJoinAndSelect('product.vehicleModel', 'vehicleModel')
      .leftJoinAndSelect('product.vehicleModels', 'vehicleModels')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere(
        '(product.name LIKE :query OR product.description LIKE :query OR product.brand LIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async getVehicleMakes(): Promise<VehicleMake[]> {
    return this.vehicleMakeRepository.find({ order: { name: 'ASC' } });
  }

  async findByVehicleMake(makeId: number): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .leftJoinAndSelect('product.vehicleModels', 'vehicleModel')
      .where('vehicleModel.makeId = :makeId', { makeId })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }
}
