import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserCreateDto, UserProfileDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { hashPwd } from '../utils/password.utils';

import { createResponse } from '../utils/createResponse';
import { LoggedUserRes } from '../../types';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(createUserDto: UserCreateDto) {
    const { email, password } = createUserDto;

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
      user.activationCode = ActivationCode.create();
      await user.save();
      return createResponse(true, 'Pomyślnie utworzono konto', 200);
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
      .where({ email: user.email })
      .getOne();
    return {
      id: selectedUser.id,
      role: selectedUser.role,
      name: selectedUser.name,
      surname: selectedUser.surname,
      email: selectedUser.email,
    };
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return await UserEntity.findOneBy({ email });
  }

  async getUserProfile(
    userId: string,
    loggedUser: UserEntity,
  ): Promise<UserEntity | null> {
    if (userId === loggedUser.id) {
      return await UserEntity.findOneBy({ id: loggedUser.id });
    }

    return await UserEntity.findOneBy({ id: userId });
  }

  async userProfileUpdate(
    user: UserEntity,
    userProfileUpdateDto: UserProfileDto,
  ) {
    const getUser = await this.dataSource
      .createQueryBuilder()
      .select('user.id')
      .from(UserEntity, 'user')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!getUser) {
      throw new BadRequestException('Użytkownik nie istnieje.');
    }

    try {
      const {} = userProfileUpdateDto;
    } catch (e) {}
  }
}
