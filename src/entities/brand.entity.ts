import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  foundedYear: number;

  @ManyToOne('Category', 'brands', { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: any;

  @Column({ nullable: true })
  categoryId: number;

  @OneToMany('Product', 'brandEntity')
  products: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
