import { Body, Controller, Post } from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { ProductFilterDto } from '../models/dtos/product.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('filter')
  async filterTags(@Body() filter: ProductFilterDto) {
    return await this.stockService.filterSizeProducts(filter);
  }
}
