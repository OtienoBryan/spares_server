import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Brand } from '../entities/brand.entity';
import { SubCategory } from '../entities/subcategory.entity';
import { Staff } from '../entities/staff.entity';
import { Blog } from '../entities/blog.entity';
import { VehicleModel } from '../entities/vehicle-model.entity';
import { VehicleMake } from '../entities/vehicle-make.entity';
import { VehicleYear } from '../entities/vehicle-year.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Order, User, Brand, SubCategory, Staff, Blog, VehicleModel, VehicleMake, VehicleYear]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
