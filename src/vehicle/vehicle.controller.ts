import {Controller, Get, UseGuards} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}



  @Get('test')
  @UseGuards(JwtAuthGuard)
  check() {
    return {
      message: 'Zalogowany'
    }
  }
}
