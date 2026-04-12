import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { Rider } from './rider.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Order {
    id: number;
    orderNumber: string;
    user: User;
    userId: number;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: string;
    billingAddress: string;
    notes: string;
    rider: Rider;
    riderId: number | null;
    assignedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
