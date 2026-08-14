import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UserDto } from '../models/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { plainPassword, ...user } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return new UserDto(savedUser);
  }

  async getUserById(id: number): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserDto(existingUser);
  }

  async getUserByEmail(email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }

    return existingUser;
  }
}
