import { Injectable, NotFoundException } from '@nestjs/common';
import { Stock } from '../models/entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockDto } from '../models/dtos/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async getStockById(id: number): Promise<StockDto> {
    const stock = await this.stockRepository.findOne({
      where: {
        id,
      },
      relations: {
        color: true,
      },
    });
    if (!stock) {
      throw new NotFoundException('stock not found');
    }

    return new StockDto(stock);
  }
}
