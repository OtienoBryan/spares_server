import { Product } from './product.entity';
import { VehicleMake } from './vehicle-make.entity';
export declare class VehicleModel {
    id: number;
    name: string;
    makeId: number | null;
    make?: VehicleMake;
    products?: Product[];
    createdAt: Date;
    updatedAt: Date;
}
