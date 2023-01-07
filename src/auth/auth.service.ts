import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { PasswordUtils } from 'src/utils/password.utils';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtPayload } from './jwt.strategy';
import { jwtConfig } from '../config/jwt.config';
import * as bcrypt from 'bcrypt';
import {UserService} from "../user/user.service";
import {stringToBoolean} from "../utils/string-to-boolean";


@Injectable()
export class AuthService {
  constructor(
      @Inject(forwardRef(() => UserService))
      private userService: UserService,
      private dataSource: DataSource,
  ) {}


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    const check = await bcrypt.compare(password, user.password);
    if (user && check) {
      return user;
    }
    return null;
  }

  // private async generateToken(user: UserEntity): Promise<string> {
  //   let token;
  //   let userWithThisToken = null;
  //   do {
  //     token = uuid();
  //     userWithThisToken = await UserEntity.findOne({
  //       where: { currentTokenId: token },
  //     });
  //   } while (!!userWithThisToken);
  //   user.currentTokenId = token;
  //   await user.save();
  //
  //   return token;
  // }


  async login(user: UserEntity, res: Response) {
    const payload = {email: user.email};
    const token = sign(payload, jwtConfig.secret, jwtConfig.signOptions)
    const oneDay = 1000 * 60 * 60 * 24;

    console.log('auth.service - login')
    // if (user.isActive == '0') {
    //   throw new BadRequestException(
    //       `Twoje konto jest nieaktywne.`
    //   )
    // }
    const userRes = await this.userService.getMe(user)
    return res
        .cookie('jwt', token, {
          secure: stringToBoolean(config.jwtCookieSecure),
          domain: config.jwtCookieDomain,
          httpOnly: config.jwtHttpOnly,
          maxAge: oneDay,
        })
        .json(userRes);
  }


  async logout(res: Response, responseObj?: { statusCode: number; message: string }) {
    const resObj = responseObj ?? { message: 'Wylogowano pomyślnie'};
    return res
        .clearCookie('jwt', {
          secure: stringToBoolean(config.jwtCookieSecure),
          domain: config.jwtCookieDomain,
          httpOnly: config.jwtHttpOnly,
        })
        .json(resObj);
  }

}