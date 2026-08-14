import { OrderItemType } from '../../enums/order.enums';
import { OrderItem } from '../entities/order-item.entity';
import { IsEnum, IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { ProductDetailsDto } from './product.dto';

export class OrderItemDto {
  id: number;
  type: OrderItemType;
  orderId: number;
  productId: number;
  stockId: number;
  quantity: number;
  price: number;

  constructor(orderItem: OrderItem) {
    this.id = orderItem.id;
    this.type = orderItem.type;
    this.orderId = orderItem.orderId;
    this.productId = orderItem.productId;
    this.stockId = orderItem.stockId;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
  }
}

export class OrderItemDetailsDto extends OrderItemDto {
  product?: ProductDetailsDto;

  constructor(orderItem: OrderItem) {
    super(orderItem);
  }
}

export class NewOrderItemDto {
  type: OrderItemType;
  productId: number;
  stockId: number;
  quantity: number;
  price: number;
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
}

export class UpdateOrderItemDto {
  @IsNumber()
  id: number;

  @IsEnum(OrderItemType)
  type: OrderItemType;

  @IsNumber()
  orderId: number;

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

  @IsOptional()
  @IsNumber()
  newStockId?: number;
}
