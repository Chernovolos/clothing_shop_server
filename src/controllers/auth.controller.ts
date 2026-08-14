import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserDto } from '../models/dtos/user.dto';

export interface RequestWithUser extends Request {
  user: UserDto;
}

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: RequestWithUser) {
    this.logger.log('attempting user auth after credentials validation');
    return this.authService.login(req.user);
  }
}
