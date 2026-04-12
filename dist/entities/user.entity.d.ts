import { Order } from './order.entity';
import { Cart } from './cart.entity';
export declare class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: Date;
    isActive: boolean;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    orders: Order[];
    carts: Cart[];
    createdAt: Date;
    updatedAt: Date;
}
