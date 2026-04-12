import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("../entities").Category[]>;
    findOne(id: number): Promise<import("../entities").Category | null>;
}
