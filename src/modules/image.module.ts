import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../models/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class ImageModule {}
