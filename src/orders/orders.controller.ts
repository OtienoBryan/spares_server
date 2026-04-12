import { Controller, Post, Get, Param, Body, Headers, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { CreateOrderDto } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Headers('user-id') userId: string) {
    console.log('OrdersController received data:', JSON.stringify(createOrderDto, null, 2));
    console.log('User ID from header:', userId);
    
    // Get user ID from header
    const parsedUserId = Number.parseInt(userId, 10);
    const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
    
    // Add userId to the DTO
    const orderData = {
      ...createOrderDto,
      userId: userIdNum,
    };

    console.log('Order data being sent to service:', JSON.stringify(orderData, null, 2));

    return await this.ordersService.createOrder(orderData);
  }

  @Get('my-orders')
  async getMyOrders(@Headers('user-id') userId: string) {
    const parsedUserId = Number.parseInt(userId, 10);
    const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
    if (userIdNum <= 0) return [];
    return await this.ordersService.getOrdersByUserId(userIdNum);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Headers('user-id') userId: string) {
    const parsedUserId = Number.parseInt(userId, 10);
    const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
    if (userIdNum <= 0) return { error: 'Order not found' };
    const order = await this.ordersService.getOrderById(parseInt(id));
    
    // Check if the order belongs to the user
    if (!order || order.userId !== userIdNum) {
      return { error: 'Order not found' };
    }
    
    return order;
  }

  @Post(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Headers('user-id') userId: string
  ) {
    const parsedUserId = Number.parseInt(userId, 10);
    const userIdNum = Number.isNaN(parsedUserId) || parsedUserId <= 0 ? 0 : parsedUserId;
    if (userIdNum <= 0) return { error: 'Order not found' };
    const order = await this.ordersService.getOrderById(parseInt(id));
    
    // Check if the order belongs to the user
    if (!order || order.userId !== userIdNum) {
      return { error: 'Order not found' };
    }
    
    return await this.ordersService.updateOrderStatus(parseInt(id), body.status as any);
  }

  @Put(':id/assign-rider')
  async assignRider(
    @Param('id') id: string,
    @Body() body: { riderId: number }
  ) {
    return await this.ordersService.assignRider(parseInt(id), body.riderId);
  }

  @Put(':id/unassign-rider')
  async unassignRider(@Param('id') id: string) {
    return await this.ordersService.unassignRider(parseInt(id));
  }
}
