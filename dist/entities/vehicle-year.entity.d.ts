import { VehicleModel } from './vehicle-model.entity';
export declare class VehicleYear {
    id: number;
    yearFrom: number;
    yearTo: number | null;
    modelId: number;
    model?: VehicleModel;
    createdAt: Date;
    updatedAt: Date;
}
