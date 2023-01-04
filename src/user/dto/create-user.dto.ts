import { UserCreate } from '../../interfaces/user';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto implements UserCreate {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  password: string;
}
