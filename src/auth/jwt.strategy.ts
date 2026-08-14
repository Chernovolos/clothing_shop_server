import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    const secret = configService.get<string>('MY_JWT_SECRET');

    if (!secret) {
      throw new Error('JWT secret is missing in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    this.logger.log(`authorizing request for user ${payload.username} [${payload.sub}]`);
    return Promise.resolve({ userId: payload.sub, username: payload.username });
  }
}
