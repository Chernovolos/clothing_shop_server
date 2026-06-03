import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../models/entities/product.entity';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';
import { TagModule } from './tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), TagModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
  // exports: [TypeOrmModule],
})
export class ProductModule {}
