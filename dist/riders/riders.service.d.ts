import { Repository } from 'typeorm';
import { Rider } from '../entities/rider.entity';
export interface CreateRiderDto {
    name: string;
    contact: string;
    cashLimit?: number;
    isActive?: boolean;
}
export interface UpdateRiderDto {
    name?: string;
    contact?: string;
    cashLimit?: number;
    isActive?: boolean;
}
export declare class RidersService {
    private readonly riderRepository;
    constructor(riderRepository: Repository<Rider>);
    findAll(): Promise<Rider[]>;
    findActive(): Promise<Rider[]>;
    findOne(id: number): Promise<Rider | null>;
    create(createRiderDto: CreateRiderDto): Promise<Rider>;
    update(id: number, updateRiderDto: UpdateRiderDto): Promise<Rider | null>;
    toggleActive(id: number): Promise<Rider | null>;
    remove(id: number): Promise<boolean>;
}
