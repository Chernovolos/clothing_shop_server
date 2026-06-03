import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from '../models/entities/color.entity';
import { ColorService } from '../services/color.service';
import { ColorController } from '../controllers/color.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorService],
  controllers: [ColorController],
  exports: [TypeOrmModule],
})
export class ColorModule {}
