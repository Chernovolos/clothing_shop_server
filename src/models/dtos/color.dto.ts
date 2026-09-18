import { Color } from '../entities/color.entity';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory, ProductSubType, ProductType } from '../../enums/product.enums';

export class ColorDto {
  id: number;
  code: string;
  hex: string;

  constructor(color: Color) {
    this.id = color.id;
    this.code = color.code;
    this.hex = color.hex;
  }
}

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(127)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(7)
  hex: string;
}

export class UpdateColorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(127)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(7)
  hex: string;
}

export class ColorFilterDto {
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
  tags?: number[];

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
