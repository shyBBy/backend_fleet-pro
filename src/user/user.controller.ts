import {Body, Controller, Get, Param, Post, Put, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {UserCreateDto, UserProfileDto,} from './dto/create-user.dto';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserObj} from '../decorators/user-object.decorator';
import {UserEntity} from './entities/user.entity';
import {ActivationUserDto} from "./dto/activation-user.dto";

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

      @Get('/list')
  @UseGuards(JwtAuthGuard)
  @UseGuards(isAdmin)
  getAll(
    @Query('page') page: string,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('email') name: string,
    @Query('search') search: string,
  ): Promise<GetPaginatedListOfAllUsersResponse> {
    return this.userService.getAllPaginatedUsers(
        Number(page),
        sort,
        order,
        email,
        search,
    );
  }

    @Post('activation')
    getOneAndCheckActivationCode(@Body() activationUserDto: ActivationUserDto) {
        console.log('w kontrolerze')
        return this.userService.activation(activationUserDto);
    }


    @Post('create')
    create(@Body() createUserDto: UserCreateDto) {
        return this.userService.create(createUserDto);
    }
}
