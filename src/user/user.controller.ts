import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {UserCreateDto, UserProfileDto,} from './dto/create-user.dto';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import { IsAdmin } from '../guards/is-admin';
import {UserObj} from '../decorators/user-object.decorator';
import {UserEntity} from './entities/user.entity';
import {ActivationUserDto} from "./dto/activation-user.dto";

import {GetPaginatedListOfAllUsersResponse} from "../../types";


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
    @UseGuards(JwtAuthGuard, IsAdmin)
    // @UseGuards(IsAdmin)
    getAll(
        @Query('page') page: string,
        @Query('sort') sort: string,
        @Query('order') order: 'ASC' | 'DESC',
        @Query('search') search: string,
    ): Promise<GetPaginatedListOfAllUsersResponse> {
        return this.userService.getAllPaginatedUsers(
            Number(page),
            sort,
            order,
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
    
    
    @Update('update/:id')
    @UseGuards(JwtAuthGuard, IsAdmin)
    async updateRole


    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @UserObj() user: UserEntity): Promise<void> {

        return this.userService.removeOneById(id, user.id);
    }
}
