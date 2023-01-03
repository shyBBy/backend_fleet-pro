import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PlaceModule } from './place/place.module';
import { DriverModule } from './driver/driver.module';
import {DatabaseModule} from "./providers/database.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, VehicleModule, PlaceModule, DriverModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
