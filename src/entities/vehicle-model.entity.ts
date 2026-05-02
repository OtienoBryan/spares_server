import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { VehicleMake } from './vehicle-make.entity';

@Entity('vehicle_models')
export class VehicleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'int', nullable: true, default: null })
  makeId: number | null;

  @ManyToOne(() => VehicleMake, { nullable: true, onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'makeId' })
  make?: VehicleMake;

  @ManyToMany(() => Product, (product) => product.vehicleModels)
  products?: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

