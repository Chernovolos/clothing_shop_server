import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../models/entities/order-item.entity';
import { Repository } from 'typeorm';
import { NewOrderItemDto, OrderItemDto } from '../models/dtos/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrderItem(orderId: number, orderItem: NewOrderItemDto) {
    const newOrderItem = this.orderItemRepository.create({
      ...orderItem,
      orderId: orderId,
    });

    const saved = await this.orderItemRepository.save(newOrderItem);
    return new OrderItemDto(saved);
  }

  async deleteOrderItem(orderId: number, id: number) {
    const item = await this.orderItemRepository.findOne({
      where: {
        orderId,
        id,
      },
    });

    if (!item) {
      throw new NotFoundException(`OrderItem with id ${orderId} not found`);
    }

    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      await this.orderItemRepository.delete(item.id);
      return null;
    }

    item.quantity = newQuantity;
    return this.orderItemRepository.save(item);
  }
}
