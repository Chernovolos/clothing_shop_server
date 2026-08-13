import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../models/entities/order.entity';
import { Repository } from 'typeorm';
import { CheckoutOrderDto, OrderDto } from '../models/dtos/order.dto';
import { OrderItemType, OrderStatus } from '../enums/order.enums';
import { CreateOrderItemDto, NewOrderItemDto, UpdateOrderItemDto } from '../models/dtos/order-item.dto';
import { OrderItem } from '../models/entities/order-item.entity';
import { OrderItemService } from './order-item.service';
import { StockService } from './stock.service';
import { ProductService } from './product.service';

@Injectable()
export class OrderService {
  private readonly logger: Logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly orderItemService: OrderItemService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
  ) {}

  async getOrCreateOrder(userId: number): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: {
        userId: userId,
        status: OrderStatus.NEW,
      },
      relations: {
        orderItems: true,
      },
    });
    this.logger.log('order', order);

    if (!order) {
      const newOrder = this.orderRepository.create({
        userId: userId,
        status: OrderStatus.NEW,
        quantity: 0,
        total: 0,
        orderItems: [],
      });
      try {
        order = await this.orderRepository.save(newOrder);
      } catch (error) {
        order = await this.orderRepository.findOne({
          where: {
            userId: userId,
            status: OrderStatus.NEW,
          },
          relations: {
            orderItems: true,
          },
        });

        if (!order) throw error;
      }
    }
    return order;
  }

  async addItemToOrder(userId: number, orderItem: CreateOrderItemDto): Promise<OrderDto> {
    const availableStock = await this.getAvailableStock(userId, orderItem.productId, orderItem.stockId);
    const order = await this.getOrCreateOrder(userId);

    this.logger.log('orderItem', orderItem);
    const existingItem = await this.orderItemRepository.findOne({
      where: {
        orderId: order.id,
        type: OrderItemType.PRODUCT,
        productId: orderItem.productId,
        stockId: orderItem.stockId,
      },
    });

    const currentQty = existingItem?.quantity ?? 0;
    const newQty = currentQty + orderItem.quantity;

    if (newQty > availableStock) {
      throw new BadRequestException('Not enough stock');
    }

    if (existingItem) {
      existingItem.quantity += orderItem.quantity;
      await this.orderItemRepository.save(existingItem);
    } else {
      const product = await this.productService.getProductById(orderItem.productId);
      const newOrderItem: NewOrderItemDto = {
        type: orderItem.type,
        productId: orderItem.productId,
        stockId: orderItem.stockId,
        quantity: orderItem.quantity,
        price: product.price,
      };
      await this.orderItemService.createOrderItem(order.id, newOrderItem);
    }
    const update = await this.recalculateOrder(order.id);
    order.quantity = update.quantity;
    order.total = update.total;
    order.orderItems = update.items;

    this.logger.log('order', order);
    return await this.getOrderDto(order);
  }

  async updateOrderAndOrderItem(userId: number, id: number, orderItem: UpdateOrderItemDto): Promise<OrderDto> {
    this.logger.log('orderItem', orderItem);
    const order = await this.orderRepository.findOne({
      where: {
        userId: userId,
        status: OrderStatus.NEW,
      },
      relations: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Not found order');
    }

    const existingItem = await this.orderItemRepository.findOne({
      where: {
        orderId: order.id,
        id: orderItem.id,
        // productId: orderItem.productId,
        // stockId: orderItem.stockId,
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Order item not found');
    }

    if (orderItem.newStockId) {
      const qtyToMove = orderItem.quantity ?? existingItem.quantity;

      const availableStock = await this.getAvailableStock(userId, existingItem.productId, orderItem.newStockId);

      const newItem = await this.orderItemRepository.findOne({
        where: {
          orderId: order.id,
          productId: existingItem.productId,
          stockId: orderItem.newStockId,
        },
      });

      const targetQty = (newItem?.quantity ?? 0) + qtyToMove;

      if (targetQty > availableStock) {
        throw new BadRequestException('Not enough stock for new variant');
      }

      if (newItem) {
        newItem.quantity = targetQty;
        await this.orderItemRepository.save(newItem);
        // newItem.price = orderItem.price ?? newItem.price;
        await this.orderItemRepository.remove(existingItem);
      } else {
        const availableStockForOld = await this.getAvailableStock(userId, existingItem.productId, existingItem.stockId);

        if (qtyToMove > availableStockForOld) {
          throw new BadRequestException('Not enough stock');
        }

        existingItem.stockId = orderItem.newStockId;
        existingItem.quantity = qtyToMove;
        // existingItem.price = orderItem.price;

        await this.orderItemRepository.save(existingItem);
      }
    } else {
      const qtyToAdd = orderItem.quantity ?? 0;
      const availableStock = await this.getAvailableStock(userId, existingItem.productId, existingItem.stockId);

      const targetQty = existingItem.quantity + qtyToAdd;

      if (targetQty > availableStock) {
        throw new BadRequestException('Not enough stock');
      }

      existingItem.quantity = targetQty;
      // existingItem.price = orderItem.price;

      await this.orderItemRepository.save(existingItem);
    }

    const update = await this.recalculateOrder(order.id);
    order.quantity = update.quantity;
    order.total = update.total;
    order.orderItems = update.items;

    return await this.getOrderDto(order);
  }

  async removeItemFromOrder(userId: number, id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: {
        userId: userId,
        status: OrderStatus.NEW,
      },
      relations: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    await this.orderItemService.deleteOrderItem(order.id, id);
    const update = await this.recalculateOrder(order.id);

    order.quantity = update.quantity;
    order.total = update.total;
    order.orderItems = update.items;

    return await this.getOrderDto(order);
  }

  async getReservedQuantity(userId: number, productId: number, stockId: number): Promise<number> {
    const result = await this.orderItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .where('item.productId= :productId', { productId: productId })
      .andWhere('item.stockId = :stockId', { stockId: stockId })
      .andWhere('order.status = :status', { status: OrderStatus.NEW })
      .andWhere('order.userId != :userId', { userId })
      .select('SUM(item.quantity)', 'totalReserved')
      .getRawOne<{ totalReserved: string | null }>();

    return Number(result?.totalReserved) || 0;
  }

  async getAvailableStock(userId: number, productId: number, stockId: number): Promise<number> {
    const stock = await this.stockService.getStockById(stockId);

    const reservedByOthers = await this.getReservedQuantity(userId, productId, stockId);

    const availableStock = stock.available - reservedByOthers;

    return availableStock < 0 ? 0 : availableStock;
  }

  private async recalculateOrder(orderId: number) {
    const items = await this.orderItemRepository.find({
      where: { orderId },
    });

    const quantity = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

    await this.orderRepository.update(orderId, {
      quantity,
      total,
    });

    return { quantity, total, items };
  }

  public async getOrderDto(order: Order): Promise<OrderDto> {
    const orderDto: OrderDto = new OrderDto(order);

    const productIds = orderDto.orderItems.map((item) => item.productId);
    const products = await this.productService.getProductsByIds(productIds);
    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of orderDto.orderItems) {
      const product = productMap.get(item.productId);

      item.product = product;
    }
    return orderDto;
  }

  public async checkOutOrder(userId: number, checkOutOrderDto: CheckoutOrderDto): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: {
        userId: userId,
        status: OrderStatus.NEW,
      },
      relations: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.orderItems.length === 0) {
      throw new BadRequestException('Order is empty.');
    }

    order.firstName = checkOutOrderDto.firstName;
    order.lastName = checkOutOrderDto.lastName;
    order.email = checkOutOrderDto.email;
    order.phone = checkOutOrderDto.phone;
    order.city = checkOutOrderDto.city;
    order.comment = checkOutOrderDto.comment;
    order.warehouseRef = checkOutOrderDto.warehouseRef;
    order.warehouseLat = checkOutOrderDto.warehouseLat;
    order.warehouseLon = checkOutOrderDto.warehouseLon;
    order.status = OrderStatus.PROCESSING;
    order.paymentMethod = checkOutOrderDto.paymentMethod;

    await this.orderRepository.save(order);

    return this.getOrderDto(order);
  }
}
