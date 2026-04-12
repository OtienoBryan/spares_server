import { OrdersService } from './orders.service';
import type { CreateOrderDto } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<import("./orders.service").OrderResponse>;
    getMyOrders(userId: string): Promise<import("./orders.service").OrderResponse[]>;
    getOrder(id: string, userId: string): Promise<import("./orders.service").OrderResponse | {
        error: string;
    }>;
    updateOrderStatus(id: string, body: {
        status: string;
    }, userId: string): Promise<import("./orders.service").OrderResponse | {
        error: string;
    } | null>;
    assignRider(id: string, body: {
        riderId: number;
    }): Promise<import("./orders.service").OrderResponse | null>;
    unassignRider(id: string): Promise<import("./orders.service").OrderResponse | null>;
}
