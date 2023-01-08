import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Response } from 'express';
import { UserEntity } from '../user/entities/user.entity';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { jwtConfig } from '../config/jwt.config';
import {UserService} from "../user/user.service";
import {stringToBoolean} from "../utils/string-to-boolean";
import {hashPwd} from "../utils/password.utils";


@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user && user.password === hashPwd(password)) {
      return user;
    }
    return null;
  }

  async login(user: UserEntity, res: Response) {
    const payload = { email: user.email };
    const token = sign(payload, jwtConfig.secret, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is inactive. Please check Your mail and click to activation link.',
      );
    }
    const userRes = await this.userService.getMe(user);
    return res
      .cookie('jwt', token, {
        secure: config.jwtCookieSecure,
        domain: config.jwtCookieDomain,
        httpOnly: config.jwtHttpOnly,
        maxAge: oneDay,
      })
      .json(userRes);
  }

  logout(res: Response, responseObj?: { statusCode: number; message: string }) {
    const resObj = responseObj ?? { message: 'Logout was successful' };
    return res
      .clearCookie('jwt', {
        secure: config.jwtCookieSecure,
        domain: config.jwtCookieDomain,
        httpOnly: config.jwtHttpOnly,
      })
      .json(resObj);
  }
}