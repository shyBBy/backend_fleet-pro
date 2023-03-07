import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Query, Delete,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  GetListOfVehiclesResponse,
  GetPaginatedListOfAllVehiclesResponse,
} from '../../types/vehicle';
import { VehicleCreateDto } from './dto/create-vehicle.dto';
import { UserObj } from '../decorators/user-object.decorator';
import { UserEntity } from '../user/entities/user.entity';
import {VehicleUpdateDto} from "./dto/update-vehicle.dto";

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: VehicleCreateDto, @UserObj() user: UserEntity) {
    console.log(createVehicleDto.placeName)
    return this.vehicleService.create(createVehicleDto, user.id);
  }



  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getAll(
    @Query('page') page: string,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('name') name: string,
    @Query('model') model: string,
    @Query('yearOfProduction') yearOfProduction: string,
    @Query('isCurrentVehicleInspection') isCurrentVehicleInspection: boolean,
    @Query('vehicleType') vehicleType: string,
    @Query('vehicleMileage') vehicleMileage: string,
    @Query('search') search: string,
  ): Promise<GetPaginatedListOfAllVehiclesResponse> {
    return this.vehicleService.getAllPaginatedVehs(
        Number(page),
        sort,
        order,
        name,
        model,
        yearOfProduction,
        Boolean(isCurrentVehicleInspection),
        vehicleType,
        Number(vehicleMileage),
        search,
    );
  }
  
  @Post('/update/:id')
  @UseGuards(JwtAuthGuard)
  updateVehicleData(
    @Param('id') vehicleId: string, 
    @Body() updateVehicleDto: VehicleUpdateDto,
    @UserObj() user: UserEntity,
    ) {
      return this.vehicleService.updateVehicleData(updateVehicleDto, user.id, vehicleId)
    }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getOneById(@Param('id') id: string) {
    return this.vehicleService.getOneById(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @UserObj() user: UserEntity): Promise<void> {
    console.log('w kontrolerze')
    return this.vehicleService.removeOneById(id, user.id);
  }
}
