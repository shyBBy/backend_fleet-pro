import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { USER_ROLE } from '../../types/user';
import { v4 as uuid } from 'uuid';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  async create(createUserDto: UserCreateDto) {
    const { name, surname, email, password } = createUserDto;

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

    const hash = await bcrypt.hash(password, 10);
    try {
      const user = new UserEntity();
      user.id = uuid();
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.password = hash;
      user.role = USER_ROLE.USER;
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
}
