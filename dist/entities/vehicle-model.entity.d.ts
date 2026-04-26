import { Product } from './product.entity';
export declare class VehicleModel {
    id: number;
    name: string;
    products?: Product[];
    createdAt: Date;
    updatedAt: Date;
}
