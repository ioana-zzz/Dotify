import { IsEmail, IsEnum, IsOptional, IsString, MinLength,IsStrongPassword, min } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class UserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @IsStrongPassword({minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
  password: string;

  @IsOptional()
  profilePicture?: string | null;

  @IsEnum(UserRole)
  role: UserRole;
}
