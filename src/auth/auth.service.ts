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
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtPayload } from './jwt.strategy';
import { jwtConfig } from '../config/jwt.config';
import * as bcrypt from 'bcrypt';
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
    if (user && user.password === hashPwd(password, user.salt)) {
      return user;
    }
    return null;
  }

  async login(user: UserEntity, res: Response) {
    const payload = { email: user.email };
    const token = sign(payload, hdhd, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is inactive. Please check Your mail and click to activation link.',
      );
    }
    const userRes = await this.userService.getMe(user);
    return res
      .cookie('jwt', token, {
        secure: stringToBoolean(.COOKIE_SECURE),
        domain: process.env.DOMAIN,
        httpOnly: true,
        maxAge: oneDay,
      })
      .json(userRes);
  }

  logout(res: Response, responseObj?: { statusCode: number; message: string }) {
    const resObj = responseObj ?? { message: 'Logout was successful' };
    return res
      .clearCookie('jwt', {
        secure: stringToBoolean(process.env.COOKIE_SECURE),
        domain: process.env.DOMAIN,
        httpOnly: true,
      })
      .json(resObj);
  }
}