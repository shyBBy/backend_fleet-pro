import {
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
@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, jwtConfig.secret, { expiresIn });
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
      userWithThisToken = await UserEntity.findOne({
        where: { currentTokenId: token },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await UserEntity.findOne({
        where: { email: req.email },
      });
      console.log(user);
      if (!user) {
        return res.status(404).json({
          message: `Błędny e-mail lub hasło.`,
          isSuccess: false,
        });
        // throw new HttpException(
        //   {
        //     message: `Błędny login lub hasło.`,
        //     isSuccess: false,
        //   },
        //   HttpStatus.NOT_FOUND,
        // );
      }
      const check = await bcrypt.compare(req.password, user.password);
      
      console.log(check);
      if (!check) {
        return res.status(404).json({
          message: `Błędny e-mail lub hasło.`,
          isSuccess: false,
        });
      }
      const token = await this.createToken(await this.generateToken(user));
      return res
        .cookie('jwt', token.accessToken, {
          secure: config.jwtCookieSecure,
          domain: config.jwtCookieDomain,
          httpOnly: config.jwtHttpOnly,
        })
        .json({
          message: 'Zalogowano pomyślnie',
          isSuccess: true,
        });
    } catch (e) {
      return res.json({
        error: e.message,
      });
    }
  }

  async logout(user: UserEntity, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: config.jwtCookieSecure,
        domain: config.jwtCookieDomain,
        httpOnly: config.jwtHttpOnly,
      });
      return res.status(200).json({
        message: 'Pomyślnie wylogowano.',
        isSuccess: true,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
}