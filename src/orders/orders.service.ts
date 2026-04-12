import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Rider } from '../entities/rider.entity';
import { ResendEmailService } from './resend-email.service';

export interface CreateOrderDto {
  // `0` (or missing) means guest checkout. The service will create/find a guest user.
  userId?: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod: string;

  // Used for guest checkout only
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  billingAddress?: string;
  notes?: string;
  items: {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: number;
      name: string;
      image: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rider)
    private riderRepository: Repository<Rider>,
    private readonly resendEmailService: ResendEmailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    console.log('Creating order with DTO:', JSON.stringify(createOrderDto, null, 2));
    
    // Validate items array
    if (!createOrderDto.items || !Array.isArray(createOrderDto.items)) {
      console.error('Invalid items array:', createOrderDto.items);
      throw new Error('Items must be an array');
    }
    
    // Generate unique order number
    const orderNumber = this.generateOrderNumber();

    // Resolve user for guest checkout
    const requestedUserId = createOrderDto.userId && createOrderDto.userId > 0 ? createOrderDto.userId : 0;
    let effectiveUserId = requestedUserId;

    if (effectiveUserId <= 0) {
      const customerName = (createOrderDto.customerName || 'Guest Customer').trim();
      const customerEmail =
        (createOrderDto.customerEmail && createOrderDto.customerEmail.trim()) ||
        `guest+${Date.now()}@guest.local`;
      const customerPhone =
        (createOrderDto.customerPhone && createOrderDto.customerPhone.trim()) || undefined;

      const nameParts = customerName.split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || 'Guest';
      const lastName = nameParts.slice(1).join(' ') || 'Customer';

      // `dateOfBirth` is required on the User entity; set a safe default.
      const dateOfBirth = new Date('1990-01-01');

      const existingGuestUser = await this.userRepository.findOne({
        where: { email: customerEmail },
      });

      const guestUser = existingGuestUser
        ? existingGuestUser
        : this.userRepository.create({
            email: customerEmail,
            firstName,
            lastName,
            phone: customerPhone,
            dateOfBirth,
            isActive: true,
            isEmailVerified: false,
          });

      // `save()` works for both newly-created and previously-existing users.
      const savedGuestUser = await this.userRepository.save(guestUser);
      effectiveUserId = savedGuestUser.id;
    }

    // Create order
    const order = this.orderRepository.create({
      orderNumber,
      userId: effectiveUserId,
      subtotal: createOrderDto.subtotal,
      tax: createOrderDto.tax,
      shipping: createOrderDto.shipping,
      total: createOrderDto.total,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
      paymentStatus: createOrderDto.paymentMethod === 'cash_on_delivery' 
        ? PaymentStatus.PENDING 
        : PaymentStatus.PAID,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems: any[] = [];
    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });

      const savedOrderItem = await this.orderItemRepository.save(orderItem);
      
      orderItems.push({
        id: savedOrderItem.id,
        productId: savedOrderItem.productId,
        quantity: savedOrderItem.quantity,
        price: savedOrderItem.price,
        total: savedOrderItem.total,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
        },
      });
    }

    const response: OrderResponse = {
      id: savedOrder.id,
      orderNumber: savedOrder.orderNumber,
      userId: savedOrder.userId,
      status: savedOrder.status,
      paymentStatus: savedOrder.paymentStatus,
      subtotal: savedOrder.subtotal,
      tax: savedOrder.tax,
      shipping: savedOrder.shipping,
      total: savedOrder.total,
      shippingAddress: savedOrder.shippingAddress,
      billingAddress: savedOrder.billingAddress,
      notes: savedOrder.notes,
      items: orderItems,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
    };

    // Notify customer + admin (never block checkout if email fails).
    const customerEmail =
      createOrderDto.customerEmail ||
      (await this.userRepository.findOne({ where: { id: effectiveUserId } }))?.email;

    const adminEmail = ['bryanotieno09@gmail.com', 'gitauj520@gmail.com'];
    const itemsForEmail = response.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.price,
      total: i.total,
    }));

    // Client email is optional; admin notification should always go out.
    try {
      if (customerEmail) {
        await this.resendEmailService.sendClientOrderConfirmation({
          to: customerEmail,
          orderNumber: response.orderNumber,
          customerName: createOrderDto.customerName,
            customerEmail,
            customerPhone: createOrderDto.customerPhone,
          shippingAddress: response.shippingAddress,
          total: response.total,
            paymentMethod: createOrderDto.paymentMethod,
            paymentStatus: response.paymentStatus,
          items: itemsForEmail,
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn('Skipping client email: missing customer email');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Resend client email notification failed:', err);
    }

    try {
      await this.resendEmailService.sendAdminNewOrderNotification({
        to: adminEmail,
        orderNumber: response.orderNumber,
        customerName: createOrderDto.customerName,
        customerEmail,
          customerPhone: createOrderDto.customerPhone,
        shippingAddress: response.shippingAddress,
        total: response.total,
        paymentMethod: createOrderDto.paymentMethod,
        paymentStatus: response.paymentStatus,
        items: itemsForEmail,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Resend admin email notification failed:', err);
    }

    return response;
  }

  async getOrdersByUserId(userId: number): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
        },
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  async getOrderById(id: number): Promise<OrderResponse | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
        },
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<OrderResponse | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return null;
    }

    order.status = status;
    await this.orderRepository.save(order);

    return this.getOrderById(id);
  }

  async assignRider(id: number, riderId: number): Promise<OrderResponse | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return null;
    }

    const rider = await this.riderRepository.findOne({ where: { id: riderId } });
    if (!rider) {
      throw new Error('Rider not found');
    }

    if (!rider.isActive) {
      throw new Error('Cannot assign inactive rider');
    }

    order.riderId = riderId;
    order.status = OrderStatus.ASSIGNED;
    order.assignedAt = new Date();
    
    await this.orderRepository.save(order);

    return this.getOrderById(id);
  }

  async unassignRider(id: number): Promise<OrderResponse | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      return null;
    }

    order.riderId = null;
    order.status = OrderStatus.PENDING;
    order.assignedAt = null;
    
    await this.orderRepository.save(order);

    return this.getOrderById(id);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }
}
