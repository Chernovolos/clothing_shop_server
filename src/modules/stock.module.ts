import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '../models/entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class StockModule {}
