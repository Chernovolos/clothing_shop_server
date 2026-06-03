import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
  CreateProductDto,
  ProductDetailsDto,
  ProductFilterDto,
} from '../models/dtos/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.addProduct(createProductDto);
  }

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Post('filter')
  async filterProducts(@Body() filter: ProductFilterDto) {
    const products = await this.productService.filterProducts(filter);
    return products.map((product) => new ProductDetailsDto(product));
  }
}
