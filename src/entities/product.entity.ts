import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { VehicleModel } from './vehicle-model.entity';
import { VehicleYear } from './vehicle-year.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  alcoholContent: string;

  @Column({ nullable: true })
  volume: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  skus: Array<{
    code: string;
    price: number;
    originalPrice?: number;
  }>;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isOnOffer: boolean;

  @Column({ default: false })
  isPopularWine: boolean;

  @Column({ default: false })
  requiresAgeVerification: boolean;

  @ManyToOne('Category', 'products')
  @JoinColumn({ name: 'categoryId' })
  category: any;

  @Column()
  categoryId: number;

  @ManyToOne('SubCategory', 'products', { nullable: true })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: any;

  @Column({ nullable: true })
  subcategoryId: number;

  @ManyToOne('Brand', 'products', { nullable: true, eager: false })
  @JoinColumn({ name: 'brandId' })
  brandEntity: any;

  @Column({ nullable: true })
  brandId: number;

  @ManyToOne(() => VehicleModel, { nullable: true, eager: false })
  @JoinColumn({ name: 'vehicleModelId' })
  vehicleModel?: VehicleModel;

  @Column({ nullable: true })
  vehicleModelId?: number | null;

  /** Additional fitments beyond the primary `vehicleModelId` (kept in sync: first id = primary). */
  @ManyToMany(() => VehicleModel, (vm) => vm.products, { eager: false })
  @JoinTable({
    name: 'product_vehicle_models',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vehicleModelId', referencedColumnName: 'id' },
  })
  vehicleModels?: VehicleModel[];

  @ManyToMany(() => VehicleYear, { eager: false })
  @JoinTable({
    name: 'product_vehicle_years',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vehicleYearId', referencedColumnName: 'id' },
  })
  vehicleYears?: VehicleYear[];

  @OneToMany(() => ProductImage, img => img.product, { eager: false })
  productImages?: ProductImage[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
