import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Exclude()
  password: string;
}
