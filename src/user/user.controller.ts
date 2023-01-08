import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserLoginDto} from './dto/create-user.dto';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserObj} from "../decorators/user-object.decorator";
import {UserEntity} from "./entities/user.entity";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getMe(@UserObj() user: UserEntity) {
    return this.userService.getMe(user);
  }

  @Post('create')
  create(@Body() createUserDto: UserCreateDto) {
    return this.userService.create(createUserDto);
  }

}
