import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { CreateColorDto, UpdateColorDto } from '../models/dtos/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  createColor(@Body() newColor: CreateColorDto) {
    return this.colorService.createColor(newColor);
  }

  @Get()
  getColors() {
    return this.colorService.getColors();
  }

  @Get(':id')
  getColorById(@Param('id') id: number) {
    return this.colorService.getColorById(id);
  }

  @Put(':id')
  updateColor(@Param('id') id: number, @Body() color: UpdateColorDto) {
    return this.colorService.updateColor(id, color);
  }

  @Delete(':id')
  deleteColor(@Param('id', ParseIntPipe) id: number) {
    return this.colorService.deleteColor(id);
  }
}
