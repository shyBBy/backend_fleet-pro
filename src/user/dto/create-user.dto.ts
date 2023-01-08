import { UserCreate } from '../../interfaces/user';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto implements UserCreate {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;


  @IsNotEmpty()
  password: string;
}



export class UserLoginDto implements UserCreate {
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  
  @IsNotEmpty()
  password: string;
}