import { Color } from '../entities/color.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
