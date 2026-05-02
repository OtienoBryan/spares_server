import { ProductsService } from './products.service';
export declare class SitemapController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getSitemap(): Promise<string>;
}
