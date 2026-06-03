import { ColorDto } from './color.dto';
import { Image } from '../entities/image.entity';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ImageDto {
  id: number;
  color: ColorDto | null;
  url: string;
  title: string;
  isPrimary: boolean;

  constructor(image: Image) {
    this.id = image.id;
    this.url = image.url;
    this.title = image.title;
    this.isPrimary = image.isPrimary;
    this.color = image.color ? new ColorDto(image.color) : null;
  }
}

export class CreateImageDto {
  @IsOptional()
  @IsInt()
  colorId?: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isPrimary: boolean;
}
