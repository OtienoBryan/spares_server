import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    stock: number;
    image: string;
    images: string[];
    brand: string;
    alcoholContent: string;
    volume: string;
    origin: string;
    tags: string[];
    skus: Array<{
        code: string;
        price: number;
        originalPrice?: number;
    }>;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    isFeatured: boolean;
    isOnOffer: boolean;
    isPopularWine: boolean;
    requiresAgeVerification: boolean;
    category: any;
    categoryId: number;
    subcategory: any;
    subcategoryId: number;
    brandEntity: any;
    brandId: number;
    cartItems: CartItem[];
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
