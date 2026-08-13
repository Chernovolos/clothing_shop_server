import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserLoginDto } from '../models/dtos/user.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userLoginDto: UserLoginDto): Promise<UserDto> {
    this.logger.log('verifying login details with: ', userLoginDto);
    const user = await this.userService.getUserByEmail(userLoginDto.email);

    const isValidPassword = bcrypt.compareSync(userLoginDto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return new UserDto(user);
  }

  login(userDto: UserDto): { accessToken: string; tokenType: 'Bearer'; user: UserDto } {
    const payload = { username: userDto.email, sub: userDto.id };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      user: userDto,
    };
  }
}
