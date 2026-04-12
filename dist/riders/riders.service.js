"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rider_entity_1 = require("../entities/rider.entity");
let RidersService = class RidersService {
    riderRepository;
    constructor(riderRepository) {
        this.riderRepository = riderRepository;
    }
    async findAll() {
        return this.riderRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findActive() {
        return this.riderRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        return this.riderRepository.findOne({ where: { id } });
    }
    async create(createRiderDto) {
        const rider = this.riderRepository.create({
            ...createRiderDto,
            cashLimit: createRiderDto.cashLimit || 0,
            isActive: createRiderDto.isActive !== undefined ? createRiderDto.isActive : true,
        });
        return this.riderRepository.save(rider);
    }
    async update(id, updateRiderDto) {
        const rider = await this.findOne(id);
        if (!rider) {
            return null;
        }
        Object.assign(rider, updateRiderDto);
        return this.riderRepository.save(rider);
    }
    async toggleActive(id) {
        const rider = await this.findOne(id);
        if (!rider) {
            return null;
        }
        rider.isActive = !rider.isActive;
        return this.riderRepository.save(rider);
    }
    async remove(id) {
        const result = await this.riderRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
};
exports.RidersService = RidersService;
exports.RidersService = RidersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rider_entity_1.Rider)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RidersService);
//# sourceMappingURL=riders.service.js.map