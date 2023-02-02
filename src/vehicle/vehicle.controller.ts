import {Controller, Get, UseGuards} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}



  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: VehicleCreateDto) {
    return this.vehicleService.create(createVehicleDto);
  }
}
