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

  npCityRef: string;
  npWarehouseRef: string;
  npWarehouseLat?: number;
  npWarehouseLon?: number;
  cityName: string;
  warehouseName: string;
  paymentMethod?: number;

  quantity: number;
  total: number;
  status: OrderStatus;
  orderItems: OrderItemDetailsDto[];
  createdAt?: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.firstName = order.firstName;
    this.lastName = order.lastName;
    this.email = order.email;
    this.phone = order.phone;
    this.comment = order.comment;

    this.npCityRef = order.npCityRef;
    this.npWarehouseRef = order.npWarehouseRef;
    this.npWarehouseLat = order.npWarehouseLat;
    this.npWarehouseLon = order.npWarehouseLon;
    this.cityName = order.cityName;
    this.warehouseName = order.warehouseName;
    this.paymentMethod = order.paymentMethod;
    this.quantity = order.quantity;
    this.total = order.total;
    this.status = order.status;
    this.orderItems = order.orderItems?.map((item) => new OrderItemDetailsDto(item)) ?? [];
    this.createdAt = order.createdAt;
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
  npCityRef: string;

  @IsString()
  npWarehouseRef: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  npWarehouseLat: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  npWarehouseLon: number;

  @IsString()
  cityName: string;

  @IsString()
  warehouseName: string;

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
