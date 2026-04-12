import { RidersService } from './riders.service';
import type { CreateRiderDto, UpdateRiderDto } from './riders.service';
export declare class RidersController {
    private readonly ridersService;
    constructor(ridersService: RidersService);
    findAll(): Promise<import("../entities").Rider[]>;
    findActive(): Promise<import("../entities").Rider[]>;
    findOne(id: number): Promise<import("../entities").Rider>;
    create(createRiderDto: CreateRiderDto): Promise<import("../entities").Rider>;
    update(id: number, updateRiderDto: UpdateRiderDto): Promise<import("../entities").Rider>;
    toggleActive(id: number): Promise<import("../entities").Rider>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
