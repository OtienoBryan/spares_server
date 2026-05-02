import { Product } from './product.entity';
export declare class ProductImage {
    id: number;
    productId: number;
    product?: Product;
    url: string;
    sortOrder: number;
    createdAt: Date;
}
