import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../models/entities/order.entity';
import { Repository } from 'typeorm';
// import { CreateOrderItemDto } from '../models/dtos/order-item.dto';
// import { OrderDto } from '../models/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // async createOrder(item: CreateOrderItemDto): Promise<OrderDto> {}
}
