import { OrderStatus } from '../../enums/order.enums';
import { Order } from '../entities/order.entity';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  id: number;
  quantity: number;
  total: number;
  status: OrderStatus;
  orderItems: OrderItemDto[];

  constructor(order: Order) {
    this.id = order.id;
    this.quantity = order.quantity;
    this.total = order.total;
    this.status = order.status;
    this.orderItems =
      order.orderItems?.map((item) => new OrderItemDto(item)) ?? [];
  }
}
