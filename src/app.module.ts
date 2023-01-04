import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { AppController } from './app.controller';
import { PlaceModule } from './place/place.module';
import { DatabaseModule } from './providers/database.module';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    VehicleModule,
    AuthModule,
    PlaceModule,
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
