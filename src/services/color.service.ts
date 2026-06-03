import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from '../models/entities/color.entity';
import {
  ColorDto,
  CreateColorDto,
  UpdateColorDto,
} from '../models/dtos/color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async createColor(newColor: CreateColorDto): Promise<ColorDto> {
    const color = this.colorRepository.create({
      code: newColor.code,
      hex: newColor.hex,
    });

    const saved = await this.colorRepository.save(color);
    return new ColorDto(saved);
  }

  async getColors(): Promise<ColorDto[]> {
    const colors = await this.colorRepository.find({
      order: { id: { direction: 'ASC' } },
    });

    return colors.map((c) => new ColorDto(c));
  }

  async getColorById(id: number): Promise<ColorDto> {
    const color = await this.colorRepository.findOne({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} is not find`);
    }

    return new ColorDto(color);
  }

  async updateColor(id: number, color: UpdateColorDto): Promise<ColorDto> {
    // const existedColor = await this.colorRepository.findOne({
    //   where: { id: id },
    // });
    //
    // if (!existedColor) {
    //   throw new NotFoundException(`Color with ID ${id} is not find`);
    // }
    //
    // const updated = this.colorRepository.merge(existedColor, color);
    // return await this.colorRepository.save(updated);

    const isExistColor = await this.checkColor(id);
    const updatedColorData = this.colorRepository.merge(isExistColor, color);
    const updatedColor = await this.colorRepository.save(updatedColorData);

    return new ColorDto(updatedColor);
  }

  async deleteColor(id: number): Promise<{ message: string }> {
    // const existedColor = await this.colorRepository.findOne({
    //   where: { id: color.id },
    // });
    //
    // if (!existedColor) {
    //   throw new NotFoundException(`Color with ID ${color.id} is not find`);
    // }
    //
    // await this.colorRepository.softDelete(color.id);
    // return existedColor;
    const result = await this.colorRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Color with ID ${id} is not found`);
    }

    return {
      message: `Color with ID ${id} was successfully deleted`,
    };
  }

  private async checkColor(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException(`Color with ID ${id} is not found`);
    }

    return color;
  }
}
