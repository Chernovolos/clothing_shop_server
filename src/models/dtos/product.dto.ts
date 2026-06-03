import {
  ProductCategory,
  ProductSubType,
  ProductType,
} from '../../enums/product.enums';
import { Product } from '../entities/product.entity';
import { ImageDto } from './image.dto';
import { StockDto } from './stock.dto';
import { TagDto } from './tag.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  id: number;
  title: string;
  price: number;
  image: ImageDto | null;

  constructor(product: Product) {
    this.id = product.id;
    this.title = product.title;
    this.price = product.price;
    this.image = product.images?.length
      ? new ImageDto(product.images[0])
      : null;
  }
}

export class ProductDetailsDto {
  id: number;
  title: string;
  categoryType: ProductCategory;
  description: string;
  price: number;
  type: ProductType;
  subType: ProductSubType;
  images: ImageDto[];
  stocks: StockDto[];
  tags: TagDto[];

  constructor(product: Product) {
    this.id = product.id;
    this.title = product.title;
    this.categoryType = product.categoryType;
    this.description = product.description;
    this.price = product.price;
    this.type = product.type;
    this.subType = product.subType;
    this.images = product.images?.map((image) => new ImageDto(image)) ?? [];
    this.stocks = product.stocks?.map((stock) => new StockDto(stock)) ?? [];
    this.tags = product.tags?.map((tag) => new TagDto(tag)) ?? [];
  }
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(127)
  title: string;

  @IsEnum(ProductCategory)
  categoryType: ProductCategory;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Price must be a valid decimal number' },
  )
  @IsPositive()
  @Max(999999.99)
  price: number;

  @IsEnum(ProductType)
  type: ProductType;

  @IsEnum(ProductSubType)
  subType: ProductSubType;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => TagDto)
  // tags: TagDto[];

  @IsArray()
  @IsNumber({}, { each: true })
  tags: number[];
}

export class ProductFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ProductCategory)
  categoryType?: ProductCategory;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ProductSubType)
  subType?: ProductSubType;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Max(999999.99)
  price?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags?: number[];
}
