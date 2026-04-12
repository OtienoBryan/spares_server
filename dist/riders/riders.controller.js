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
exports.RidersController = void 0;
const common_1 = require("@nestjs/common");
const riders_service_1 = require("./riders.service");
let RidersController = class RidersController {
    ridersService;
    constructor(ridersService) {
        this.ridersService = ridersService;
    }
    async findAll() {
        return this.ridersService.findAll();
    }
    async findActive() {
        return this.ridersService.findActive();
    }
    async findOne(id) {
        const rider = await this.ridersService.findOne(id);
        if (!rider) {
            throw new common_1.HttpException('Rider not found', common_1.HttpStatus.NOT_FOUND);
        }
        return rider;
    }
    async create(createRiderDto) {
        try {
            return await this.ridersService.create(createRiderDto);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create rider', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateRiderDto) {
        const rider = await this.ridersService.update(id, updateRiderDto);
        if (!rider) {
            throw new common_1.HttpException('Rider not found', common_1.HttpStatus.NOT_FOUND);
        }
        return rider;
    }
    async toggleActive(id) {
        const rider = await this.ridersService.toggleActive(id);
        if (!rider) {
            throw new common_1.HttpException('Rider not found', common_1.HttpStatus.NOT_FOUND);
        }
        return rider;
    }
    async remove(id) {
        const success = await this.ridersService.remove(id);
        if (!success) {
            throw new common_1.HttpException('Rider not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'Rider deleted successfully' };
    }
};
exports.RidersController = RidersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RidersController.prototype, "remove", null);
exports.RidersController = RidersController = __decorate([
    (0, common_1.Controller)('api/riders'),
    __metadata("design:paramtypes", [riders_service_1.RidersService])
], RidersController);
//# sourceMappingURL=riders.controller.js.map