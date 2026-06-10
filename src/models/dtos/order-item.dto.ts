import { OrderItemType } from '../../enums/order.enums';
import { OrderItem } from '../entities/order-item.entity';
import { IsEnum, IsNumber, IsPositive, Max } from 'class-validator';

export class OrderItemDto {
  id: number;
  type: OrderItemType;
  orderId: number;
  productId: number;
  stockId: number;
  quantity: number;
  price: number;

  constructor(order_item: OrderItem) {
    this.id = order_item.id;
    this.type = order_item.type;
    this.orderId = order_item.id;
    this.productId = order_item.id;
    this.stockId = order_item.id;
    this.quantity = order_item.quantity;
    this.price = order_item.price;
  }
}

export class CreateOrderItemDto {
  @IsEnum(OrderItemType)
  type: OrderItemType;

  @IsNumber()
  productId: number;

  @IsNumber()
  stockId: number;

  @IsNumber()
  @IsPositive()
  @Max(999999.99)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Max(999999.99)
  price: number;
}
