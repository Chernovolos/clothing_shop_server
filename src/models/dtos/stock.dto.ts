import { ColorDto } from './color.dto';
import { Stock } from '../entities/stock.entity';
import { ProductSize } from '../../enums/product.enums';

export class StockDto {
  id: number;
  productSize: ProductSize;
  available: number;
  color: ColorDto | null;

  constructor(stock: Stock) {
    this.id = stock.id;
    this.productSize = stock.productSize;
    this.available = stock.available;
    this.color = stock.color ? new ColorDto(stock.color) : null;
  }
}
