import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorModule } from './modules/color.module';
import { ImageModule } from './modules/image.module';
import { ProductModule } from './modules/product.module';
import { StockModule } from './modules/stock.module';
import { TagModule } from './modules/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/models/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        logNotifications: true,

        migrationsRun: true,
        migrationsTableName: 'migrations',
        migrationsTransactionMode: 'all',
        migrations: [__dirname + '/migrations/*{.js,.ts}'],
      }),
    }),
    ProductModule,
    ColorModule,
    ImageModule,
    StockModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
