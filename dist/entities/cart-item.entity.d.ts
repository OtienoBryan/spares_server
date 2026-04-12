import { Cart } from './cart.entity';
import { Product } from './product.entity';
export declare class CartItem {
    id: number;
    cart: Cart;
    cartId: number;
    product: Product;
    productId: number;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
