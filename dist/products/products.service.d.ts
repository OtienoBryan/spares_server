import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { VehicleMake } from '../entities/vehicle-make.entity';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    private vehicleMakeRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, vehicleMakeRepository: Repository<VehicleMake>);
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    findByCategory(categoryId: number): Promise<Product[]>;
    findFeatured(): Promise<Product[]>;
    findPopularWines(): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    getCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category | null>;
    getVehicleMakes(): Promise<VehicleMake[]>;
    findByVehicleMake(makeId: number): Promise<Product[]>;
}
