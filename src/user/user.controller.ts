import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {UserService} from './user.service';
import {UserCreateDto, UserProfileDto,} from './dto/create-user.dto';
import {JwtAuthGuard} from '../guards/jwt-auth.guard';
import {UserObj} from '../decorators/user-object.decorator';
import {UserEntity} from './entities/user.entity';
import {FileFieldsInterceptor, FileInterceptor} from '@nestjs/platform-express';
import {ActivationUserDto} from "./dto/activation-user.dto";
import * as path from 'path';
import {GetPaginatedListOfAllUsersResponse, MulterDiskUploadedFiles, UserRes} from "../../types";
import {IsAdmin} from "../guards/is-admin.guard";
import {multerStorage, storageDir} from "../utils/storage";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    getMe(@UserObj() user: UserEntity) {
        return this.userService.getMe(user);
    }


    @Get('/list')
    @UseGuards(JwtAuthGuard, IsAdmin)
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

    @Post(':userId/avatar')
    @UseInterceptors(
        FileFieldsInterceptor([
                {
                    name: 'avatar', maxCount: 10,
                },
            ], {storage: multerStorage(path.join(storageDir(), 'user-avatars'))},
        ),
    )
    uploadAvatar(
        @Param('userId') userId: string,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<any> {
        return this.userService.uploadAvatar(userId, files);
    }


    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() userProfileUpdateDto: UserProfileDto,
        @UserObj() loggedUser: UserRes
    ) {
        return this.userService.userProfileUpdate(loggedUser, userProfileUpdateDto, id);
    }


    @Delete('/:id')
    @UseGuards(JwtAuthGuard, IsAdmin)
    async remove(@Param('id') id: string, @UserObj() user: UserEntity): Promise<void> {

        return this.userService.removeOneById(id, user.id);
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    userProfile(@Param('userId') userId: string, @UserObj() user: UserEntity) {
        return this.userService.getUserProfile(userId, user);
    }


    @Get('/photo/:id')
    async getPhoto(
        @Param('id') id: string,
        @Res() res: any,
    ): Promise<any> {
        return this.userService.getPhoto(id, res)
    }
}
