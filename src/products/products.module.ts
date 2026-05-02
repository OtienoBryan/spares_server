import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { VehicleMakesPublicController } from './vehicle-makes-public.controller';
import { SitemapController } from './sitemap.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { VehicleMake } from '../entities/vehicle-make.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, VehicleMake])],
  controllers: [ProductsController, VehicleMakesPublicController, SitemapController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
