import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '../models/entities/stock.entity';
import { StockService } from '../services/stock.service';
import { StockController } from '../controllers/stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
