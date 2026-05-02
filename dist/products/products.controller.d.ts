import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("../entities").Product[]>;
    findFeatured(): Promise<import("../entities").Product[]>;
    findPopularWines(): Promise<import("../entities").Product[]>;
    search(query: string): Promise<import("../entities").Product[]>;
    findByCategory(categoryId: number): Promise<import("../entities").Product[]>;
    findByVehicleMake(makeId: number): Promise<import("../entities").Product[]>;
    findOne(id: number): Promise<import("../entities").Product | null>;
}
