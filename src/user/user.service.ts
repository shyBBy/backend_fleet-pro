import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { UserCreateDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import {AuthService} from "../auth/auth.service";
import {LoggedUserRes} from "../interfaces/user";
import {hashPwd} from "../utils/password.utils";

@Injectable()
export class UserService {
  constructor(
      private dataSource: DataSource,
      @Inject(forwardRef(() => AuthService)) private authService: AuthService,
      ) {}


  async create(createUserDto: UserCreateDto) {
    const {email, password } = createUserDto;

    const checkEmail = await UserEntity.findOneBy({ email });

    if (checkEmail) {
      throw new HttpException(
        {
          message: `Konto o podanym email: ${email} już istnieje.`,
          isSuccess: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = new UserEntity();
      user.id = uuid();
      user.email = email;
      user.password = hashPwd(password);
      await user.save();
      return {
        message: `Pomyślnie utworzono konto.`,
        isSuccess: true,
      };
    } catch (e) {
      throw new HttpException(
        {
          message: `Coś poszło nie tak, spróbuj później.`,
          isSuccess: false,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getMe(user: UserEntity): Promise<LoggedUserRes> {
    const selectedUser = await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from(UserEntity, 'user')
        .where({email: user.email})
        .getOne();
    console.log(`w userService, selectedUser = ${selectedUser} --------- selectedUser.id = ${selectedUser.id} --------- selectedUser[2] = ${selectedUser[2]} --------- `)
    return {
      id: selectedUser.id,
      role: selectedUser.role,
      name: selectedUser.name,
      surname: selectedUser.surname,
      email: selectedUser.email,
    };
  }


  async getByEmail(email: string): Promise<UserEntity | null> {
    return await UserEntity.findOneBy({email})
  }
  
  
  
  
  
  async userProfileUpdate(user: UserEntity, userProfileUpdateDto: UserProfileDto){
    
    const user = await this.dataSource.createQueryBuilder().select('user.id'). from(UserEntity, 'user').where('user.id = :id', {id: user.id}).getOne()
    
    if (!user){
      throw new BadRequestException('Użytkownik nie istnieje.');
    }
    
    try {
      
      const {} = userProfileUpdateDto;
      
    } catch(e) {
      
    }
  }
  
 
}
