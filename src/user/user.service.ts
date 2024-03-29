import {
    BadRequestException,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {UserCreateDto, UserProfileDto} from './dto/create-user.dto';
import {UserEntity} from './entities/user.entity';
import {v4 as uuid} from 'uuid';
import {DataSource, Like} from 'typeorm';
import {AuthService} from '../auth/auth.service';
import {hashPwd} from '../utils/password.utils';

import {createResponse} from '../utils/createResponse';
import {GetPaginatedListOfAllUsersResponse, MulterDiskUploadedFiles, UserRes} from '../../types';
import {ActivationCode} from "../utils/activationCodeCreater";
import {ActivationUserDto} from "./dto/activation-user.dto";
import {MailerService} from '@nestjs-modules/mailer';
import {mailTemplate} from "../utils/mailTemplate";
import * as fs from "fs";
import * as path from "path";
import {storageDir} from "../utils/storage";

// import {deleteFile} from "../utils/deleteFile";

@Injectable()
export class UserService {
    constructor(
        private dataSource: DataSource,
        private readonly mailerService: MailerService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    ) {
    }

    async create(createUserDto: UserCreateDto) {
        const {email, password} = createUserDto;

        const checkEmail = await UserEntity.findOneBy({email});

        if (checkEmail) {
            throw new HttpException(
                {
                    message: `Konto o podanym email: ${email} już istnieje.`,
                    isSuccess: false,
                },
                HttpStatus.BAD_REQUEST,
            );
        }


        try {
            const activationCode = ActivationCode.create();
            const user = new UserEntity();
            user.id = uuid();
            user.email = email;
            user.password = hashPwd(password);
            user.isActive = false;
            user.activationCode = activationCode;
            await user.save();
            await this.mailerService.sendMail({
                to: `${email}`,
                subject: 'Kod aktywacyjny',
                text: 'Test e-mail',
                html: mailTemplate(activationCode),
            })
            return createResponse(true, 'Pomyślnie utworzono konto, sprawdź poczte e-mail.', 200);
        } catch (e) {
            throw new HttpException(
                {
                    message: `Coś poszło nie tak, spróbuj później.`,
                    isSuccess: false,
                },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async getMe(user: UserEntity): Promise<UserRes> {
        const selectedUser = await this.dataSource
            .createQueryBuilder()
            .select('user')
            .from(UserEntity, 'user')
            .where({email: user.email})
            .getOne();
        return {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            surname: selectedUser.surname,
            isActive: selectedUser.isActive,
            avatar: selectedUser.avatar,
            role: selectedUser.role,
            jobPosition: selectedUser.jobPosition,
            placeName: selectedUser.placeName,
        };
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await UserEntity.findOneBy({email});
    }

    async getUserProfile(
        userId: string,
        loggedUser: UserEntity,
    ): Promise<UserEntity | null> {
        if (userId === loggedUser.id) {
            return await UserEntity.findOneBy({id: loggedUser.id});
        }

        return await UserEntity.findOneBy({id: userId});
    }


    async userProfileUpdate(
        loggedUser: UserRes,
        userProfileUpdateDto: UserProfileDto,
        userId: string
    ) {
        const {name, surname, email, placeName, jobPosition, role, isActive, permissions} = userProfileUpdateDto
        const user = await UserEntity.findOneBy({id: userId})

        if (!user) {
            throw new BadRequestException('Użytkownik nie istnieje.');
        }

        let isActiveBoolean: boolean;

        switch (isActive) {
            case 'Aktywny':
                isActiveBoolean = true;
                break;
            case 'Nieaktywny':
                isActiveBoolean = false;
                break;
            default:
                isActiveBoolean = false;
        }

        try {
            user.name = name;
            user.surname = surname;
            user.email = email;

            if (loggedUser.role === 'Administrator') {
                user.placeName = placeName
                user.role = role
                user.jobPosition = jobPosition
                user.isActive = isActiveBoolean
                user.permissions = permissions
  
            }

            await user.save()

            return createResponse(true, 'Pomyślnie edytowano informacje.', 200);
        } catch (e) {
            console.log('Catch error:', e)
        }
    }


    async uploadAvatar(id: string, files: MulterDiskUploadedFiles) {
        const avatar = files?.avatar?.[0] ?? null;

        try {
            const user = await UserEntity.findOneBy({id})

            if (!user) {
                throw new BadRequestException('Użytkownik nie istnieje.');
            }

            if (avatar) {
                if (user.avatar) {
                    const filePath = path.join(storageDir(), 'user-avatars', user.avatar);
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (e) {
                            throw e
                        }
                    }
                }
                user.avatar = avatar.filename
            }
            await user.save()
        } catch (e) {
            try {
                if (avatar) {
                    fs.unlinkSync(
                        path.join(storageDir(), 'user-avatars', avatar.filename)
                    );
                }
            } catch (e2) {
            }

            throw e;
        }
    }

    async getAllPaginatedUsers(
        page = 1,
        sort: string,
        order: 'ASC' | 'DESC',
        search: string,
    ): Promise<GetPaginatedListOfAllUsersResponse> {
        const maxOnPage = 10
        const filterValues = {}

        if (typeof sort === 'undefined') {

            let searchOptions = [
                {email: Like(`%${search}%`)},
                {isActive: Like(`%${search}%`)},
                {role: Like(`%${search}%`)},
            ]

            try {
                const [users, totalEntitiesCount] = await UserEntity.findAndCount({
                    where: !search ? filterValues : searchOptions,
                    skip: maxOnPage * (page - 1),
                    take: maxOnPage,
                })
                const pagesCount = Math.ceil(totalEntitiesCount / maxOnPage);
                if (!users.length) {
                    return {
                        users: [],
                        pagesCount: 0,
                        resultsCount: 0,
                    };
                }
                return {
                    users,
                    pagesCount,
                    resultsCount: totalEntitiesCount,
                };
            } catch (e) {
                console.log(e);
                throw new HttpException(
                    {
                        message: `Cos poszlo nie tak, spróbuj raz jeszcze.`,
                        isSuccess: false,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }


    async activation(activationUserDto: ActivationUserDto) {
        const {email, activationCode} = activationUserDto;


        try {
            const user = await UserEntity.findOneBy({email});

            if (!user) {
                throw new HttpException(
                    {
                        message: `Konto o podanym adresie e-mail nie znajduje się w bazie danych.`,
                        isSuccess: false,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const compare: boolean = ActivationCode.compare(user.activationCode, activationCode)

            if (!compare) {
                throw new HttpException(
                    {
                        message: `Niepoprawny kod aktywacyjny`,
                        isSuccess: false,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            user.isActive = true
            await user.save();
            return createResponse(true, 'Pomyślnie aktywowano konto, możesz się zalogować', 200)

        } catch (e) {
            throw new HttpException(
                {
                    message: `Coś poszło nie tak, spróbuj ponownie.`,
                    isSuccess: false,
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }


    async removeOneById(id: string, userId) {
        const user = await UserEntity.findOneBy({id})
        try {
            if (user.avatar !== null) {
                fs.unlinkSync(
                    path.join(storageDir(), 'user-avatars', user.avatar)
                );
            }
            const result = await UserEntity.delete(id)
            if (result.affected === 0) {
                throw new NotFoundException(`Uzytkownik o podanym ID:  ${id} nie istnieje.`);
            }
        } catch (e) {

        }

    }


    async getPhoto(id: string, res: any) {
        try {
            const user = await UserEntity.findOneBy({id})
            if (!user) {
                throw new NotFoundException(`Uzytkownik o podanym ID:  ${id} nie istnieje.`);
            }
            if (!user.avatar) {
                throw new NotFoundException(`Użytkownik nie posiada zdjęcia`);
            }

            res.sendFile(
                user.avatar,
                {
                    root: path.join(storageDir(), 'user-avatars'),
                },
            )
        } catch (e) {
            throw e;
        }
    }

}
