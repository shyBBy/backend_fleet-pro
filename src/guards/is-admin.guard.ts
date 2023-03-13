import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from 'types';

@Injectable()
export class IsAdmin implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { role } = context.switchToHttp().getRequest().user;

    return role === USER_ROLE.ADMIN;
  }

  handle(context: ExecutionContext) {
    throw new HttpException('Nie posiadasz odpowiednich uprawnień do tej sekcji.', HttpStatus.UNAUTHORIZED);
  }
}
