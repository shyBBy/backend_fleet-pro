import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { AppController } from './app.controller';
import { PlaceModule } from './place/place.module';
import { DatabaseModule } from './providers/database.module';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {config} from "./config/config";
import {UserEntity} from "./user/entities/user.entity";
import {VehicleEntity} from "./vehicle/entities/vehicle.entity";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: config.dbHost,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbDatabase,
        entities: [
            UserEntity,
            VehicleEntity,
        ],
        bigNumberStrings: false,
        logging: true,
        synchronize: true,
      }),
    UserModule,
    VehicleModule,
    AuthModule,
    PlaceModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
