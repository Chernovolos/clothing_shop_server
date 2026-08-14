import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // this.logger.log(req.body);
    this.logger.log(`attempting login with email [${email}]`);
    const user = await this.authService.validateUser({ email, password });
    return user;
  }
}
