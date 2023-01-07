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


  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userService.getByEmail(email);
  //   const check = await bcrypt.compare(password, user.password);
  //   if (user && check) {
  //     return user;
  //   }
  //   return null;
  // }

    private createToken(currentTokenId: string): {accessToken: string, expiresIn: number} {
      const payload: JwtPayload = {id: currentTokenId};
      const expiresIn = 60 * 60 * 24;
      const accessToken = sign(payload, jwtConfig.secret, jwtConfig.signOptions);
      return {
          accessToken,
          expiresIn,
      };
    }

  private async generateToken(user: UserEntity): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await UserEntity.findOneBy({currentTokenId: token});
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

    async login(req: AuthLoginDto, res: Response): Promise<any> {
      try {
          const user = await UserEntity.findOneBy({
              email: req.email,
              password: hashPwd(req.password)
          });

          const token = await this.createToken(await this.generateToken(user));

          const userRes = (user) => {
              const {password, currentTokenId, ...filteredUserRes} = user;
              return filteredUserRes;
          }
        console.log(userRes(user))
          return res
              .cookie('jwt', token.accessToken, {
                  secure: config.jwtCookieSecure,
                  domain: config.jwtCookieDomain,
                  httpOnly: config.jwtHttpOnly,
              })
              .json(userRes(user))
      } catch (e) {
          return res.json({error: e.message});
      }
    }

  // async login(user: UserEntity, res: Response) {
  //   const payload = {email: user.email};
  //   const token = sign(payload, jwtConfig.secret, jwtConfig.signOptions)
  //   const oneDay = 1000 * 60 * 60 * 24;
  //
  //   console.log('auth.service - login')
  //   // if (user.isActive == '0') {
  //   //   throw new BadRequestException(
  //   //       `Twoje konto jest nieaktywne.`
  //   //   )
  //   // }
  //   const userRes = await this.userService.getMe(user)
  //   return res
  //       .cookie('jwt', token, {
  //         secure: stringToBoolean(config.jwtCookieSecure),
  //         domain: config.jwtCookieDomain,
  //         httpOnly: config.jwtHttpOnly,
  //         maxAge: oneDay,
  //       })
  //       .json(userRes);
  // }


  async logout(user: UserEntity, res: Response) {
      try {
          user.currentTokenId = null;
          await user.save();
          res.clearCookie(
              'jwt', {
                  secure: config.jwtCookieSecure,
                  domain: config.jwtCookieDomain,
                  httpOnly: config.jwtHttpOnly,
              }
          );
          return res.json({ok: true});
      } catch (e) {
          return res.json({error: e.message});
      }
  }

}