import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ResendEmailService } from './resend-email.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Rider } from '../entities/rider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, User, Rider]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ResendEmailService],
  exports: [OrdersService],
})
export class OrdersModule {}
