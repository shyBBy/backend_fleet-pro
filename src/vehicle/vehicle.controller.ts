import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Query,
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

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: VehicleCreateDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getOneById(@Param('id') id: string) {
    return this.vehicleService.getOneById(id);
  }

  @Get('remove/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.vehicleService.removeOneById(id);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getAll(
    @Query('page') page: string,
    @Query('count') count: string,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('name') name: string,
    @Query('model') model: string,
    @Query('yearOfProduction') yearOfProduction: string,
    @Query('isCurrentVehicleInspection') isCurrentVehicleInspection: boolean,
    @Query('vehicleType') vehicleType: string,
  ): Promise<GetPaginatedListOfAllVehiclesResponse> {
    return this.vehicleService.getAllPaginatedVehs(
      Number(page),
      Number(count),
      sort,
      order,
      name,
      model,
      yearOfProduction,
      Boolean(isCurrentVehicleInspection),
      vehicleType,
    );
  }

  // @Post('/:id/addtoplace')
  // @UseGuards(JwtAuthGuard)
  // addVehicleToPlace(@Body() addVehToPlace: AddVehToPlaceDto, @UserObj() user: UserEntity, @Param('id') vehId: string) {
  //   return this.placeService.addVehicleToPlace(addVehicleToPlace, user, vehId)
  // }
}
