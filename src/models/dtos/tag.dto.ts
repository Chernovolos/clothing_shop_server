import { Tag } from '../entities/tag.entity';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory, ProductSubType, ProductType } from '../../enums/product.enums';

export class TagDto {
  id: number;
  title: string;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.title = tag.title;
  }
}

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}

export class TagFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ProductCategory)
  categoryType?: ProductCategory;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsEnum(ProductSubType, { each: true })
  subType?: ProductSubType[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  colors?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  sizes?: number[];

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(999999.99)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(999999.99)
  maxPrice?: number;
}
