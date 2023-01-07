import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, VerifiedCallback} from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/entities/user.entity";

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await UserEntity.findOneBy({currentTokenId: payload.id});
    if (!user) {
      return done(new UnauthorizedException(), false)
    }
    done(null, user)
  }
}