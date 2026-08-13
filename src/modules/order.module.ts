import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../models/entities/order.entity';
import { OrderItem } from '../models/entities/order-item.entity';
import { OrderService } from '../services/order.service';
import { OrderItemService } from '../services/order-item.service';
import { OrderController } from '../controllers/order.controller';
import { StockModule } from './stock.module';
import { ProductModule } from './product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), StockModule, ProductModule],
  providers: [OrderService, OrderItemService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
