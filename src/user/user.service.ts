import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable,} from '@nestjs/common';
import {UserCreateDto, UserProfileDto} from './dto/create-user.dto';
import {UserEntity} from './entities/user.entity';
import {v4 as uuid} from 'uuid';
import {DataSource} from 'typeorm';
import {AuthService} from '../auth/auth.service';
import {hashPwd} from '../utils/password.utils';

import {createResponse} from '../utils/createResponse';
import {LoggedUserRes} from '../../types';
import {ActivationCode} from "../utils/activationCodeCreater";
import {ActivationUserDto} from "./dto/activation-user.dto";
import { MailerService } from '@nestjs-modules/mailer';
import {mailTemplate} from "../utils/mailTemplate";

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

    async getMe(user: UserEntity): Promise<LoggedUserRes> {
        const selectedUser = await this.dataSource
            .createQueryBuilder()
            .select('user')
            .from(UserEntity, 'user')
            .where({email: user.email})
            .getOne();
        return {
            id: selectedUser.id,
            role: selectedUser.role,
            name: selectedUser.name,
            surname: selectedUser.surname,
            email: selectedUser.email,
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
        user: UserEntity,
        userProfileUpdateDto: UserProfileDto,
    ) {
        const getUser = await this.dataSource
            .createQueryBuilder()
            .select('user.id')
            .from(UserEntity, 'user')
            .where('user.id = :id', {id: user.id})
            .getOne();

        if (!getUser) {
            throw new BadRequestException('Użytkownik nie istnieje.');
        }

        try {
            const {} = userProfileUpdateDto;
        } catch (e) {
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
}
