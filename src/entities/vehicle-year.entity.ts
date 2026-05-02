import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { VehicleModel } from './vehicle-model.entity';

@Entity('vehicle_years')
@Unique(['yearFrom', 'yearTo', 'modelId'])
export class VehicleYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  yearFrom: number;

  @Column({ type: 'int', nullable: true, default: null })
  yearTo: number | null;

  @Column({ type: 'int' })
  modelId: number;

  @ManyToOne(() => VehicleModel, { nullable: false, onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'modelId' })
  model?: VehicleModel;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
