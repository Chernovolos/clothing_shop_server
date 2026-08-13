import { OrderPaymentType, OrderStatus } from '../../enums/order.enums';
import { Order } from '../entities/order.entity';
import { OrderItemDetailsDto } from './order-item.dto';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment?: string;

  city: string;
  warehouseRef: string;
  warehouseLat?: number;
  warehouseLon?: number;
  paymentMethod?: number;

  quantity: number;
  total: number;
  status: OrderStatus;
  orderItems: OrderItemDetailsDto[];

  constructor(order: Order) {
    this.id = order.id;
    this.firstName = order.firstName;
    this.lastName = order.lastName;
    this.email = order.email;
    this.phone = order.phone;
    this.comment = order.comment;

    this.city = order.city;
    this.warehouseRef = order.warehouseRef;
    this.warehouseLat = order.warehouseLat;
    this.warehouseLon = order.warehouseLon;
    this.paymentMethod = order.paymentMethod;
    this.quantity = order.quantity;
    this.total = order.total;
    this.status = order.status;
    this.orderItems = order.orderItems?.map((item) => new OrderItemDetailsDto(item)) ?? [];
  }
}

export class CheckoutOrderDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  city: string;

  @IsString()
  warehouseRef: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseLat: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseLon: number;

  @IsEnum(OrderPaymentType)
  paymentMethod: OrderPaymentType;
}

export class CreateOrderDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  userId: number;
}

export class WarehouseDto {
  ref: string;
  lat?: number;
  lon?: number;
}
