import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>);
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    findByCategory(categoryId: number): Promise<Product[]>;
    findFeatured(): Promise<Product[]>;
    findPopularWines(): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    getCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category | null>;
}
