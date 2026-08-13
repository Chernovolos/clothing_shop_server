import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';
import { User } from '../entities/user.entity';
import { Transform, TransformFnParams } from 'class-transformer';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Length(3, 225)
  @Matches(/^[a-zA-Zа-яА-ЯїЇєЄіІ0-9\s'_-]+$/, { message: 'Invalid characters in first name' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(3, 225)
  @Matches(/^[a-zA-Zа-яА-ЯїЇєЄіІ0-9\s'_-]+$/, { message: 'Invalid characters in last name' })
  lastName: string;

  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value?.toLowerCase().trim() : value,
  )
  @IsString()
  @MaxLength(225)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  plainPassword: string;
}

export class UserLoginDto {
  @IsString()
  @MaxLength(225)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
