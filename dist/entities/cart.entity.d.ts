import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: number;
    user: User;
    userId: number;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    createdAt: Date;
    updatedAt: Date;
}
