import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {UserCreateDto, UserLoginDto, UserProfileDto} from './dto/create-user.dto';
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
  
  @Put('/')
  @UseGuards(JwtAuthGuard)
  userProfileUpdate(
    @UserObj() user: UserEntity,
    @Body() userProfileUpdateDto: UserProfileDto,
  ) {
    return this.userService.userProfileUpdate(
      user,
      userProfileUpdateDto,
    );
  }
  
  
  @Get('profile/:userId')
  @UseGuards(JwtAuthGuard)
  userProfile(
    @Param('userId') userId: string,
    @UserObj() user: UserEntity,
    ) {
      return this.userService.getUserProfile(userId, user)
    }


  @Post('create')
  create(@Body() createUserDto: UserCreateDto) {
    return this.userService.create(createUserDto);
  }

}
