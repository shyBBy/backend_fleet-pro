import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AppService} from './app.service';
import {VehicleModule} from './vehicle/vehicle.module';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {UserEntity} from './user/entities/user.entity';
import {VehicleEntity} from './vehicle/entities/vehicle.entity';
import {MailerModule} from "@nestjs-modules/mailer";
import {AdminModule} from './admin/admin.module';
import {LastChangeEntity} from "./admin/entities/lastChange.entity";
import {TechnicalDataEntity} from "./vehicle/entities/technical-data.entity";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [UserEntity, VehicleEntity, LastChangeEntity, TechnicalDataEntity],
            bigNumberStrings: Boolean(process.env.DB_BIG_NUMBER_STRINGS),
            logging: Boolean(process.env.DB_LOGGING),
            synchronize: Boolean(process.env.DB_SYNCHRONIZE),
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAILER_HOST,
                port: Number(process.env.MAILER_PORT),
                auth: {
                    user: process.env.MAILER_USER,
                    pass: process.env.MAILER_PASSWORD,
                },
            },
            defaults: {
                from: process.env.MAILER_USER,
            },
        }),
        UserModule,
        VehicleModule,
        AuthModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
