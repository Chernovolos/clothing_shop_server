import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return (
      'Hello World!' +
      ` Database is located at: ${this.configService.get<string>('DB_HOST')}:${this.configService.get<string>('DB_PORT')}` +
      ` Frontend ia located at: ${this.configService.get<string>('ALLOWED_ORIGIN')}`
    );
  }
}
