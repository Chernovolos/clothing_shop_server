import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../models/dtos/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  getSelf(@Req() req: Request & { user: { userId: string } }) {
    const userId: string | null = req.user.userId ?? null;
    if (userId === null) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }

    return this.userService.getUserById(Number.parseInt(userId));
  }
}
