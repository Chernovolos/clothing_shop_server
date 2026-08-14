import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../models/dtos/order-item.dto';
import { CheckoutOrderDto } from '../models/dtos/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('order')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Req() req: Request & { user: { userId: string } }) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    const order = await this.orderService.getOrCreateOrder(Number.parseInt(userId));
    return this.orderService.getOrderDto(order);
  }

  @Put('order/checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: Request & { user: { userId: string } }, @Body() checkOutOrderDto: CheckoutOrderDto) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return this.orderService.checkOutOrder(Number.parseInt(userId), checkOutOrderDto);
  }

  @Post('order-item/add')
  @UseGuards(JwtAuthGuard)
  async addOrder(@Req() req: Request & { user: { userId: string } }, @Body() orderItem: CreateOrderItemDto) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return this.orderService.addItemToOrder(Number.parseInt(userId), orderItem);
  }

  @Put('order-item/update/:id')
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id: number,
    @Body() orderItem: UpdateOrderItemDto,
  ) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return this.orderService.updateOrderAndOrderItem(Number.parseInt(userId), id, orderItem);
  }

  @Delete('order-item/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id: string,
  ) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return this.orderService.removeItemFromOrder(Number.parseInt(userId), Number.parseInt(id));
  }
}
