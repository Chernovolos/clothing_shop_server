import { Controller } from '@nestjs/common';
import { StockService } from '../services/stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
}
