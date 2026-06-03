import { Tag } from '../entities/tag.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
