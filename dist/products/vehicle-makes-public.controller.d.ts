import { ProductsService } from './products.service';
export declare class VehicleMakesPublicController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAll(): Promise<import("../entities").VehicleMake[]>;
}
