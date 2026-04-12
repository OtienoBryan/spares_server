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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createOrder(createOrderDto, userId) {
        console.log('OrdersController received data:', JSON.stringify(createOrderDto, null, 2));
        console.log('User ID from header:', userId);
        const parsedUserId = Number.parseInt(userId, 10);
        const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
        const orderData = {
            ...createOrderDto,
            userId: userIdNum,
        };
        console.log('Order data being sent to service:', JSON.stringify(orderData, null, 2));
        return await this.ordersService.createOrder(orderData);
    }
    async getMyOrders(userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
        if (userIdNum <= 0)
            return [];
        return await this.ordersService.getOrdersByUserId(userIdNum);
    }
    async getOrder(id, userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
        if (userIdNum <= 0)
            return { error: 'Order not found' };
        const order = await this.ordersService.getOrderById(parseInt(id));
        if (!order || order.userId !== userIdNum) {
            return { error: 'Order not found' };
        }
        return order;
    }
    async updateOrderStatus(id, body, userId) {
        const parsedUserId = Number.parseInt(userId, 10);
        const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
        if (userIdNum <= 0)
            return { error: 'Order not found' };
        const order = await this.ordersService.getOrderById(parseInt(id));
        if (!order || order.userId !== userIdNum) {
            return { error: 'Order not found' };
        }
        return await this.ordersService.updateOrderStatus(parseInt(id), body.status);
    }
    async assignRider(id, body) {
        return await this.ordersService.assignRider(parseInt(id), body.riderId);
    }
    async unassignRider(id) {
        return await this.ordersService.unassignRider(parseInt(id));
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    __param(0, (0, common_1.Headers)('user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('user-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign-rider'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "assignRider", null);
__decorate([
    (0, common_1.Put)(':id/unassign-rider'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "unassignRider", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('api/orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map