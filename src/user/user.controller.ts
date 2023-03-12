import {Body, Controller, Get, Param, Post, Put, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {UserCreateDto, UserProfileDto,} from './dto/create-user.dto';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserObj} from '../decorators/user-object.decorator';
import {UserEntity} from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

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
        return this.userService.userProfileUpdate(user, userProfileUpdateDto);
    }

    @Get('profile/:userId')
    @UseGuards(JwtAuthGuard)
    userProfile(@Param('userId') userId: string, @UserObj() user: UserEntity) {
        return this.userService.getUserProfile(userId, user);
    }


    @Get('activation/:userId')
    getOneAndCheckActivationCode(@Param('userId') userId: string) {
        return ''
    }


    @Post('create')
    create(@Body() createUserDto: UserCreateDto) {
        return this.userService.create(createUserDto);
    }
}
